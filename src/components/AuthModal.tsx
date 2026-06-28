/**
 * @file AuthModal.tsx
 * @description Single-file modal managing user and admin registration, standard and Google authentication, user profile dashboards, and administrative controls.
 * @purpose To provide the entry point for authentication, customer engagement (inbox offers, active orders tracking), and simple store operations.
 * @interaction Connected directly to Firebase Auth, Firestore streams, and Node.js nodemailer order dispatch API.
 * 
 * Major Architecture Decisions:
 * Decision: Implementing standard login and administrative controls in a single, well-structured tabbed UI modal.
 * Why: Keeps the single-screen application flow intact, respects user's single-view intent, and simplifies routing.
 * Benefits: Extremely high cohesion, no page-reload delays, and shared state context.
 * Potential Drawbacks: File contains multiple nested UI screens; resolved by extracting sub-views.
 * Future Scalability Impact: If the admin panel grows, the components can easily be split into an /admin directory.
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Sparkles, 
  User, 
  ShoppingBag, 
  Inbox, 
  Trash2, 
  Check, 
  AlertCircle, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Upload, 
  LogOut, 
  Search 
} from 'lucide-react';
import { 
  auth, 
  db, 
  googleProvider 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  User as AuthUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { CartItem, Product, FirestoreOrder, FirebaseUserProfile, UserInboxMessage } from '../types';
import { brandImageMap } from '../data/products';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOpenCart: () => void;
}

export default function AuthModal({ isOpen, onClose, cartItems, setCartItems, onOpenCart }: AuthModalProps) {
  // Authentication states
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Active navigation tab for logged-in screens
  const [activeTab, setActiveTab] = useState<'orders' | 'inbox' | 'admin_orders' | 'admin_products' | 'admin_users'>('inbox');

  // Firestore retrieved data states
  const [userOrders, setUserOrders] = useState<FirestoreOrder[]>([]);
  const [userInbox, setUserInbox] = useState<UserInboxMessage[]>([]);
  
  // Admin operational states
  const [allOrders, setAllOrders] = useState<FirestoreOrder[]>([]);
  const [allUsers, setAllUsers] = useState<FirebaseUserProfile[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // Admin form controllers
  const [searchEmail, setSearchEmail] = useState('');
  const [targetAdminEmail, setTargetAdminEmail] = useState('');
  
  // Product creation form
  const [prodForm, setProdForm] = useState({
    brand: 'Supermom' as any,
    productName: '',
    system: 'Pant' as any,
    size: 'S' as any,
    weightRange: '4-8 kg',
    minWeight: 4,
    maxWeight: 8,
    packQty: '42 pcs',
    qtyNumber: 42,
    mrp: 950,
    badge: 'Premium Soft',
    imageColor: 'from-blue-400 to-indigo-300'
  });
  const [prodImageBase64, setProdImageBase64] = useState<string>('');

  /* ----------------------------------------------------
     1. LISTEN TO AUTH STATE CHANGES
     ---------------------------------------------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setErrorMsg('');
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          let profile: FirebaseUserProfile;

          if (docSnap.exists()) {
            profile = docSnap.data() as FirebaseUserProfile;
            // Ensure email-matching admin has role synchronized
            if (currentUser.email === 'thekidsnestbd@gmail.com' && profile.role !== 'admin') {
              profile.role = 'admin';
              await updateDoc(userDocRef, { role: 'admin' });
            }
          } else {
            // New register or Google user profile instantiation
            const isDefaultAdmin = currentUser.email === 'thekidsnestbd@gmail.com';
            profile = {
              id: currentUser.uid,
              email: currentUser.email || '',
              role: isDefaultAdmin ? 'admin' : 'user',
              displayName: currentUser.displayName || displayName || 'Valued Customer',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profile);
          }

          setUserProfile(profile);

          // Bootstrap the user's Inbox with the required first promotional offer
          await ensureFirstOfferCreated(currentUser.uid, profile.displayName || 'Customer');

          // Synchronize local cart state with user's Firestore cart, or vice versa
          if (profile.cart && profile.cart.length > 0 && cartItems.length === 0) {
            setCartItems(profile.cart);
          } else if (cartItems.length > 0) {
            await updateDoc(userDocRef, { cart: cartItems });
          }

          // Direct view focus to admin console if the user is an administrator
          if (profile.role === 'admin') {
            setActiveTab('admin_orders');
          } else {
            setActiveTab('inbox');
          }

        } catch (err: any) {
          console.error("Profile synchronization failure:", err);
          setErrorMsg("Could not sync user profile database details.");
        } finally {
          setLoading(false);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [cartItems.length]);

  /* ----------------------------------------------------
     2. SYNCHRONIZE CART TO FIRESTORE ON EDITS
     ---------------------------------------------------- */
  useEffect(() => {
    if (user && userProfile) {
      const updateCartInDb = async () => {
        try {
          await updateDoc(doc(db, 'users', user.uid), { cart: cartItems });
        } catch (e) {
          console.error("Cart DB sync fail:", e);
        }
      };
      updateCartInDb();
    }
  }, [cartItems]);

  /* ----------------------------------------------------
     3. BOOTSTRAP REAL-TIME FIRESTORE STREAMS
     ---------------------------------------------------- */
  useEffect(() => {
    if (!user) {
      setUserOrders([]);
      setUserInbox([]);
      return;
    }

    // Customer Inbox Subscription
    const inboxQuery = query(
      collection(db, 'users', user.uid, 'inbox'),
      orderBy('createdAt', 'desc')
    );
    const unsubInbox = onSnapshot(inboxQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserInboxMessage[];
      setUserInbox(msgs);
    }, (err) => {
      console.error("Inbox feed subscription error:", err);
    });

    // Customer Personal Orders Subscription
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreOrder[];
      setUserOrders(ords);
    }, (err) => {
      console.error("Personal orders subscription error:", err);
    });

    return () => {
      unsubInbox();
      unsubOrders();
    };
  }, [user]);

  // Admin Dashboard Global Listeners (Activated only if user profile is admin)
  useEffect(() => {
    if (!userProfile || userProfile.role !== 'admin') return;

    // Stream ALL Orders for Admin
    const allOrdersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubAllOrders = onSnapshot(allOrdersQuery, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreOrder[];
      setAllOrders(ords);
    });

    // Stream CUSTOM Admin Products
    const productsQuery = query(collection(db, 'products'));
    const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setAllProducts(prods);
    });

    // Fetch registered user profiles for promotion list
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const usrs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUserProfile[];
      setAllUsers(usrs);
    });

    return () => {
      unsubAllOrders();
      unsubProducts();
      unsubUsers();
    };
  }, [userProfile]);

  /* ----------------------------------------------------
     4. USER ACTION UTILITIES
     ---------------------------------------------------- */
  
  /**
   * Purpose: Installs the required 'first offer' promotional message for new registrants.
   * Input: userId, customerName
   */
  const ensureFirstOfferCreated = async (userId: string, customerName: string) => {
    try {
      const offerDocRef = doc(db, 'users', userId, 'inbox', 'first-offer');
      const offerSnap = await getDoc(offerDocRef);
      
      if (!offerSnap.exists()) {
        await setDoc(offerDocRef, {
          id: 'first-offer',
          text: `স্বাগতম ${customerName}। TheKidsNest তার প্রথম ১০০ জন কাষ্টমারকে সারা বছর মনে রাখবে। আর আপনি তাদের একজন।`,
          createdAt: new Date().toISOString(),
          senderEmail: 'thekidsnestbd@gmail.com'
        });
      }
    } catch (e) {
      console.error("Bootstrap welcome offer error:", e);
    }
  };

  /**
   * Action: Register user via email and password
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password || !displayName) {
      setErrorMsg('Please populate all fields completely.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setSuccessMsg('Registration completed successfully! Welcome to TheKidsNest.');
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email address is already in use.');
      } else {
        setErrorMsg(err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Action: Login user via email and password
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) {
      setErrorMsg('Please specify both email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setSuccessMsg('Logged in successfully!');
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password combination.');
      } else {
        setErrorMsg(err.message || 'Login credentials failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Action: Sign in securely with Google Account popup
   */
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMsg('Google login successful!');
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Action: End user auth session
   */
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setSuccessMsg('Logged out successfully.');
      onClose();
    } catch (err: any) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
     5. ADMINISTRATOR OPERATIONS
     ---------------------------------------------------- */

  /**
   * Action: Elevate a user profile role to "admin"
   * Input: userId string
   */
  const promoteUserToAdmin = async (uid: string, email: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: 'admin' });
      setSuccessMsg(`Successfully upgraded ${email} to administrator!`);
    } catch (e: any) {
      setErrorMsg(`Could not promote user: ${e.message}`);
    }
  };

  /**
   * Action: Promote a user via email input search
   */
  const handlePromoteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!targetAdminEmail) return;

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', targetAdminEmail.trim().toLowerCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setErrorMsg('No registered user profile found matching this email address.');
        return;
      }

      const userDoc = snap.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), { role: 'admin' });
      setSuccessMsg(`Upgraded ${targetAdminEmail} to administrator role!`);
      setTargetAdminEmail('');
    } catch (err: any) {
      setErrorMsg(`Promotion failed: ${err.message}`);
    }
  };

  /**
   * Action: Dispatch an inbox message/notification to a customer
   */
  const sendInboxMessage = async (userId: string, userEmail: string) => {
    const textPrompt = prompt(`Enter message content to deliver to ${userEmail}'s inbox:`);
    if (!textPrompt || !textPrompt.trim()) return;

    try {
      const msgId = `msg-${Date.now()}`;
      await setDoc(doc(db, 'users', userId, 'inbox', msgId), {
        id: msgId,
        text: textPrompt.trim(),
        createdAt: new Date().toISOString(),
        senderEmail: userProfile?.email || 'admin@thekidsnest.com'
      });
      alert('Message delivered successfully!');
    } catch (e: any) {
      alert(`Dispatch failed: ${e.message}`);
    }
  };

  /**
   * Action: Adjust order fulfillment status (accept/decline/pending)
   */
  const updateOrderStatus = async (orderId: string, newStatus: 'accepted' | 'declined' | 'pending') => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (e: any) {
      alert(`Could not update order status: ${e.message}`);
    }
  };

  /**
   * Action: Delete order document
   */
  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this order permanently?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e: any) {
      alert(`Deletion failed: ${e.message}`);
    }
  };

  /**
   * Action: Add customizable product to catalog
   */
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!prodForm.productName) {
      setErrorMsg('Product Name is required.');
      return;
    }

    try {
      const customId = `prod-custom-${Date.now()}`;
      const newProduct: Product = {
        id: customId,
        brand: prodForm.brand,
        productName: prodForm.productName,
        system: prodForm.system === 'pant' ? 'Pant' : 'Belt',
        size: prodForm.size,
        weightRange: prodForm.weightRange,
        minWeight: Number(prodForm.minWeight),
        maxWeight: Number(prodForm.maxWeight),
        packQty: prodForm.packQty,
        qtyNumber: Number(prodForm.qtyNumber),
        mrp: Number(prodForm.mrp),
        imageColor: prodForm.imageColor,
        image: prodImageBase64 || brandImageMap[prodForm.brand] || '',
        badge: prodForm.badge || undefined
      };

      await setDoc(doc(db, 'products', customId), newProduct);
      setSuccessMsg('Product added successfully to Firestore catalogs!');
      
      // Reset Form fields
      setProdForm({
        brand: 'Supermom',
        productName: '',
        system: 'Pant',
        size: 'S',
        weightRange: '4-8 kg',
        minWeight: 4,
        maxWeight: 8,
        packQty: '42 pcs',
        qtyNumber: 42,
        mrp: 950,
        badge: 'Premium Soft',
        imageColor: 'from-blue-400 to-indigo-300'
      });
      setProdImageBase64('');
    } catch (err: any) {
      setErrorMsg(`Failed to save product: ${err.message}`);
    }
  };

  /**
   * Action: Remove a dynamic product from Firestore
   */
  const handleRemoveProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      setSuccessMsg('Product removed successfully.');
    } catch (err: any) {
      setErrorMsg(`Deletion failed: ${err.message}`);
    }
  };

  /**
   * Action: Handle uploader file input, transform to Base64
   */
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 2) { // 2MB restriction
      alert('File size exceeds 2MB. Please upload a smaller package image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProdImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Guard: Avoid rendering when modal is inactive
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]"
        id="auth-dashboard-container"
      >
        
        {/* Header Block */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <h2 className="font-sans text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {userProfile 
                ? (userProfile.role === 'admin' ? 'Admin Dashboard (কন্ট্রোল প্যানেল)' : 'My Account Dashboard') 
                : 'Welcome to TheKidsNest'
              }
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 cursor-pointer"
            id="close-auth-modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Dynamic Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Messages Alert System */}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
            </div>
          )}

          {!loading && !user && (
            /* ----------------------------------------------------
               A. AUTHENTICATION SCREENS (LOGIN & REGISTER)
               ---------------------------------------------------- */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-4">
              
              {/* Branding and Social pitch */}
              <div className="md:col-span-5 flex flex-col justify-center space-y-4 pr-0 md:pr-4">
                <span className="font-bold text-xs uppercase tracking-widest text-rose-500">
                  Exclusive Subscriber Offers
                </span>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                  Do you want to get বর্ষীয়াণ অফার about Diaper ?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  If you want then register. Subscriber members unlock our finest offers and gentle baby diaper deals!
                </p>

                {/* Google Login Trigger */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-xs cursor-pointer"
                  id="google-signin-btn"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google Login</span>
                </button>
              </div>

              {/* Standard Email Form Divider */}
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="h-px w-full md:h-full md:w-px bg-slate-100 dark:bg-slate-800" />
              </div>

              {/* Email Login Forms */}
              <div className="md:col-span-6">
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                    className={`flex-1 pb-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${authMode === 'login' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    id="tab-select-login"
                  >
                    Sign In (লগইন)
                  </button>
                  <button 
                    onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                    className={`flex-1 pb-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${authMode === 'register' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    id="tab-select-register"
                  >
                    Register (নিবন্ধন)
                  </button>
                </div>

                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Your Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                          <User className="h-4.5 w-4.5" />
                        </span>
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="মায়ের নাম বা বাবার নাম"
                          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 py-3.5 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-hidden transition-all"
                          id="input-auth-name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Mail className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 py-3.5 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-hidden transition-all"
                        id="input-auth-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Lock className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 py-3.5 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-hidden transition-all"
                        id="input-auth-pass"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 p-3.5 text-sm font-bold text-white shadow-md hover:from-rose-600 hover:to-rose-700 transition-all cursor-pointer flex justify-center items-center"
                    id="submit-auth-btn"
                  >
                    <span>{authMode === 'login' ? 'Sign In Now' : 'Create Free Account'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {!loading && user && userProfile && (
            /* ----------------------------------------------------
               B. LOGGED-IN ACCOUNT DASHBOARDS
               ---------------------------------------------------- */
            <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
              
              {/* Account Left Sidebar Drawer */}
              <div className="md:w-64 border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-4 flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                  {/* Avatar Profile mini card */}
                  <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/30 rounded-2xl p-4 text-center">
                    <div className="h-14 w-14 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">
                      {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{userProfile.displayName || 'Customer'}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{userProfile.email}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/20">
                      {userProfile.role === 'admin' ? '🛡️ Store Admin' : '👶 Active Customer'}
                    </span>
                  </div>

                  {/* Navigation Tabs List */}
                  <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                    {userProfile.role === 'admin' ? (
                      <>
                        <button
                          onClick={() => setActiveTab('admin_orders')}
                          className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${activeTab === 'admin_orders' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40'}`}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Orders Manage ({allOrders.length})</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('admin_products')}
                          className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${activeTab === 'admin_products' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40'}`}
                        >
                          <Plus className="h-4 w-4" />
                          <span>Custom Products</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('admin_users')}
                          className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${activeTab === 'admin_users' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40'}`}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>Manage Admins</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveTab('inbox')}
                          className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${activeTab === 'inbox' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40'}`}
                        >
                          <Inbox className="h-4 w-4" />
                          <span>Subscriber Offers / Inbox ({userInbox.length})</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Log Out button */}
                <button
                  onClick={handleLogout}
                  className="mt-6 flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100/50"
                  id="account-logout-btn"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>

              {/* Account Primary Content Window */}
              <div className="flex-1 bg-slate-50/30 dark:bg-slate-900/40 rounded-3xl p-5 border border-slate-100 dark:border-slate-800">
                
                {/* T1. CUSTOMER ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      আমার অর্ডারসমূহ (Order History)
                    </h3>
                    
                    {userOrders.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-40 text-rose-500" />
                        <p className="text-sm">আপনি এখনও কোনো অর্ডার প্লেস করেননি।</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userOrders.map((ord) => (
                          <div 
                            key={ord.id}
                            className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4 shadow-2xs"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-slate-400 font-bold"># {ord.id.slice(0, 12)}</span>
                                <span className="text-[10px] text-slate-400">| {new Date(ord.createdAt).toLocaleDateString('bn-BD')}</span>
                              </div>
                              <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                                {ord.items.map((it, idx) => (
                                  <div key={idx}>
                                    • {it.product.brand} {it.product.system} - Size {it.product.size} ({it.quantity} packs)
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-slate-400">
                                ঠিকানা: {ord.shippingAddress} | মোবাইল: {ord.customerPhone}
                              </p>
                            </div>
                            <div className="flex flex-row md:flex-col justify-between items-end shrink-0">
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Billed</span>
                                <span className="font-extrabold text-sm text-rose-500">৳ {ord.totalPrice} BDT</span>
                              </div>
                              
                              {/* Status Badges */}
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border mt-2 ${
                                ord.status === 'accepted' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                  : ord.status === 'declined'
                                  ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400'
                                  : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400'
                              }`}>
                                {ord.status === 'accepted' && <Check className="h-3 w-3" />}
                                {ord.status === 'declined' && <XCircle className="h-3 w-3" />}
                                {ord.status === 'pending' && <Clock className="h-3 w-3" />}
                                {ord.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* T2. CUSTOMER INBOX TAB (READ-ONLY) */}
                {activeTab === 'inbox' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                        স্পেশাল অফার ইনবক্স (Special Offers & Messages)
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                        Admin Direct
                      </span>
                    </div>

                    {userInbox.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Inbox className="h-10 w-10 mx-auto mb-3 opacity-40 text-rose-500" />
                        <p className="text-sm">আপনার ইনবক্সে কোনো নতুন বার্তা বা অফার নেই।</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userInbox.map((msg) => (
                          <div 
                            key={msg.id}
                            className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-rose-100/30 dark:border-slate-800 shadow-xs relative overflow-hidden group"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(msg.createdAt).toLocaleString('bn-BD')}
                              </span>
                              <span className="text-[10px] font-bold text-rose-500/80 uppercase">
                                Sender: {msg.senderEmail}
                              </span>
                            </div>
                            <p className="font-sans text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* T3. ADMIN ORDERS LIST TAB */}
                {activeTab === 'admin_orders' && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      অর্ডারস কন্ট্রোল প্যানেল (Order Management)
                    </h3>
                    
                    {allOrders.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-40 text-slate-500" />
                        <p className="text-sm">কোনো অর্ডার এখনো আসেনি।</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {allOrders.map((ord) => (
                          <div 
                            key={ord.id}
                            className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                              <div>
                                <span className="font-mono text-xs font-extrabold text-slate-400 uppercase">OrderID: {ord.id}</span>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  তারিখ: {new Date(ord.createdAt).toLocaleString('bn-BD')}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                  ord.status === 'accepted' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                    : ord.status === 'declined'
                                    ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400'
                                    : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400'
                                }`}>
                                  {ord.status}
                                </span>
                              </div>
                            </div>

                            {/* Recipient details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                                <p><strong>গ্রাহকের নাম:</strong> {ord.customerName}</p>
                                <p>
                                  <strong>মোবাইল নম্বর:</strong>{' '}
                                  <a href={`tel:${ord.customerPhone}`} className="text-rose-500 hover:underline font-bold">
                                    {ord.customerPhone}
                                  </a>
                                </p>
                                <p><strong>ঠিকানা:</strong> {ord.shippingAddress}</p>
                                <p><strong>জেলা:</strong> {ord.deliveryDistrict === 'sylhet' ? 'Sylhet (Inside)' : 'Outside Sylhet'}</p>
                              </div>
                              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Order Items</span>
                                <div className="space-y-1">
                                  {ord.items.map((it, idx) => (
                                    <p key={idx} className="text-xs text-slate-500 dark:text-slate-400">
                                      • {it.product.brand} - Size {it.product.size} x{it.quantity} (৳{it.product.mrp * it.quantity})
                                    </p>
                                  ))}
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-2 flex justify-between font-extrabold text-slate-700 dark:text-slate-200">
                                  <span>সর্বমোট বিল:</span>
                                  <span className="text-rose-500">৳ {ord.totalPrice} BDT</span>
                                </div>
                              </div>
                            </div>

                            {/* Admin Order Status Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-50 dark:border-slate-800">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'accepted')}
                                  disabled={ord.status === 'accepted'}
                                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Accept</span>
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'declined')}
                                  disabled={ord.status === 'declined'}
                                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>Decline</span>
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'pending')}
                                  disabled={ord.status === 'pending'}
                                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Pending</span>
                                </button>
                              </div>

                              <button
                                onClick={() => deleteOrder(ord.id)}
                                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-500 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* T4. ADMIN PRODUCTS CATALOG ADD/REMOVE */}
                {activeTab === 'admin_products' && (
                  <div className="space-y-6">
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      পণ্য কন্ট্রোল প্যানেল (Add & Remove Products)
                    </h3>

                    {/* New Product Creator Form */}
                    <form onSubmit={handleAddProduct} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block">নতুন ডায়াপার যুক্ত করুন (Add New Product)</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">BRAND</label>
                          <select 
                            value={prodForm.brand}
                            onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value as any })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          >
                            <option value="Supermom">Supermom</option>
                            <option value="Avonee">Avonee</option>
                            <option value="Mina">Mina</option>
                            <option value="Twinkle">Twinkle</option>
                            <option value="NeoCare">NeoCare</option>
                            <option value="Fresh">Fresh</option>
                            <option value="Comfort Care">Comfort Care</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">PRODUCT DISPLAY NAME</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Baby Pant Diaper Large"
                            value={prodForm.productName}
                            onChange={(e) => setProdForm({ ...prodForm, productName: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">DIAPER SYSTEM</label>
                          <select 
                            value={prodForm.system}
                            onChange={(e) => setProdForm({ ...prodForm, system: e.target.value as any })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          >
                            <option value="Pant">Pant (প্যান্ট)</option>
                            <option value="Belt">Belt (বেল্ট)</option>
                            <option value="Tape">Tape (টেপ)</option>
                            <option value="Belt/Tape">Belt/Tape Combined</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">SIZE</label>
                          <select 
                            value={prodForm.size}
                            onChange={(e) => setProdForm({ ...prodForm, size: e.target.value as any })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          >
                            <option value="NB">NB (Newborn)</option>
                            <option value="S">S (Small)</option>
                            <option value="M">M (Medium)</option>
                            <option value="L">L (Large)</option>
                            <option value="XL">XL (Extra Large)</option>
                            <option value="XXL">XXL</option>
                            <option value="XXXL">XXXL</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">WEIGHT LIMIT (e.g. 7-12 kg)</label>
                          <input 
                            type="text" 
                            required
                            placeholder="7-12 kg"
                            value={prodForm.weightRange}
                            onChange={(e) => setProdForm({ ...prodForm, weightRange: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">MIN WEIGHT (NUMERIC)</label>
                          <input 
                            type="number" 
                            required
                            value={prodForm.minWeight}
                            onChange={(e) => setProdForm({ ...prodForm, minWeight: parseInt(e.target.value) })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">MAX WEIGHT (NUMERIC)</label>
                          <input 
                            type="number" 
                            required
                            value={prodForm.maxWeight}
                            onChange={(e) => setProdForm({ ...prodForm, maxWeight: parseInt(e.target.value) })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">PACK SIZE DESC (e.g. 42 pcs)</label>
                          <input 
                            type="text" 
                            required
                            placeholder="42 pcs"
                            value={prodForm.packQty}
                            onChange={(e) => setProdForm({ ...prodForm, packQty: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">QUANTITY NUMBER</label>
                          <input 
                            type="number" 
                            required
                            value={prodForm.qtyNumber}
                            onChange={(e) => setProdForm({ ...prodForm, qtyNumber: parseInt(e.target.value) })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">MRP PRICE (BDT)</label>
                          <input 
                            type="number" 
                            required
                            value={prodForm.mrp}
                            onChange={(e) => setProdForm({ ...prodForm, mrp: parseInt(e.target.value) })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">RIBBON BADGE</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Best Softness"
                            value={prodForm.badge}
                            onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      {/* Image Upload Area */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">UPLOAD PACKAGING IMAGE (Base64 uploader)</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-rose-200 hover:border-rose-400 hover:bg-rose-50/30 rounded-xl cursor-pointer text-slate-500 dark:border-slate-700 text-xs font-semibold transition-all">
                            <Upload className="h-4.5 w-4.5 text-rose-500 animate-bounce" />
                            <span>Select Pack Image</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageFileChange}
                              className="hidden" 
                            />
                          </label>
                          {prodImageBase64 ? (
                            <div className="relative h-12 w-12 rounded-xl border overflow-hidden shrink-0 shadow-xs">
                              <img src={prodImageBase64} alt="Pack Thumbnail Preview" className="h-full w-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => setProdImageBase64('')}
                                className="absolute top-0 right-0 p-0.5 bg-slate-950/70 text-white rounded-full"
                              >
                                <X className="h-2 w-2" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">অথবা কোনো ফাইল নির্বাচন না করলে ব্র্যান্ডের ডিফল্ট ছবি ব্যবহৃত হবে।</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs flex justify-center items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Product to Store</span>
                      </button>
                    </form>

                    {/* Firestore custom added product table list */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Firestore added Products ({allProducts.length})</h4>
                      {allProducts.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6 bg-white dark:bg-slate-800 rounded-2xl border">কোনো কাস্টম প্রোডাক্ট এখনো ডেটাবেজে যোগ করা হয়নি।</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {allProducts.map((p) => (
                            <div 
                              key={p.id}
                              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 flex justify-between items-center shadow-2xs gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                  {p.image ? (
                                    <img src={p.image} className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-lg flex justify-center items-center h-full">👶</span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{p.productName}</span>
                                  <span className="text-[10px] text-slate-400 block">{p.brand} • Size {p.size} ({p.packQty}) • ৳{p.mrp}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveProduct(p.id)}
                                className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-red-500 text-slate-400 transition-colors shrink-0 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* T5. ADMIN USERS & PROMOTIONS TAB */}
                {activeTab === 'admin_users' && (
                  <div className="space-y-6">
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      অ্যাডমিন প্যানেল (Administrator Roles Setup)
                    </h3>

                    {/* Promote email form */}
                    <form onSubmit={handlePromoteByEmail} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-end gap-3 shadow-2xs">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Promote User by Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="user@example.com"
                          value={targetAdminEmail}
                          onChange={(e) => setTargetAdminEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                          id="promote-email-input"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                        id="promote-email-btn"
                      >
                        Elevate User
                      </button>
                    </form>

                    {/* Users list database representation */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Registered Users Profiles list ({allUsers.length})</h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {allUsers.map((u) => (
                          <div 
                            key={u.id}
                            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex justify-between items-center shadow-3xs gap-4 text-xs"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-100">{u.displayName || 'Customer'}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{u.email} | ID: {u.id.slice(0, 8)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {u.role === 'admin' ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/20">
                                  🛡️ Admin Role
                                </span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => sendInboxMessage(u.id, u.email)}
                                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950/40 border border-rose-200/10 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    Send Message
                                  </button>
                                  <button
                                    onClick={() => promoteUserToAdmin(u.id, u.email)}
                                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-50 hover:bg-rose-500 hover:text-white dark:bg-slate-900 border transition-colors cursor-pointer"
                                  >
                                    Promote
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
