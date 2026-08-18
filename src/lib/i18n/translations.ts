// ============================================================
// LifeLink — Translation Dictionary
// Supports: English (en), Bengali (bn), Hindi (hi)
// To add a new language: add a new key matching the Language type,
// then duplicate the 'en' block and translate the values.
// ============================================================

export type Language = "en" | "bn" | "hi";

export interface Translations {
  // ── Meta ──────────────────────────────────────────────────
  meta: {
    langName: string;
    langNameNative: string;
    dir: "ltr" | "rtl";
  };

  // ── Navigation ────────────────────────────────────────────
  nav: {
    home: string;
    features: string;
    howItWorks: string;
    about: string;
    contact: string;
    login: string;
    getStarted: string;
    language: string;
  };

  // ── Hero Section ──────────────────────────────────────────
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    headline3: string;
    description: string;
    descriptionHighlight: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustHipaa: string;
    trustActive: string;
    trustRealtime: string;
    scrollLabel: string;
    phoneLabel: string;
    phoneHold: string;
    phoneGpsStatus: string;
    phoneProfileLabel: string;
    statLivesSaved: string;
    statHospitals: string;
    statResponse: string;
    statUptime: string;
    ticker: string[];
  };

  // ── Features Section ──────────────────────────────────────
  features: {
    badge: string;
    heading: string;
    headingGradient: string;
    subheading: string;
    learnMore: string;
    items: {
      sos: { title: string; description: string };
      hospital: { title: string; description: string };
      tracking: { title: string; description: string };
      qrCard: { title: string; description: string };
      aiTriage: { title: string; description: string };
      familyAlerts: { title: string; description: string };
    };
  };

  // ── How It Works Section ──────────────────────────────────
  howItWorks: {
    badge: string;
    heading: string;
    headingGradient: string;
    subheading: string;
    steps: {
      step1: { title: string; description: string };
      step2: { title: string; description: string };
      step3: { title: string; description: string };
      step4: { title: string; description: string };
      step5: { title: string; description: string };
      step6: { title: string; description: string };
    };
  };

  // ── Stats Section ─────────────────────────────────────────
  stats: {
    badge: string;
    heading: string;
    headingGradient: string;
    subheading: string;
    activeEmergencies: string;
    hospitalsOnline: string;
    avgResponse: string;
    satisfaction: string;
  };

  // ── Testimonials Section ──────────────────────────────────
  testimonials: {
    badge: string;
    heading: string;
    headingGradient: string;
    subheading: string;
    items: {
      priya: { role: string; text: string };
      rajesh: { role: string; text: string };
      ananya: { role: string; text: string };
    };
  };

  // ── Live Feed Section ─────────────────────────────────────
  liveFeed: {
    badge: string;
    heading: string;
    headingGradient: string;
    description: string;
    statActive: string;
    statAmbulances: string;
    statHospitals: string;
    feedHeader: string;
    liveBadge: string;
    feedFooter: string;
  };

  // ── Video Showcase Section ───────────────────────────────
  videoShowcase: {
    badge: string;
    heading: string;
    headingGradient: string;
    subheading: string;
    v1Title: string;
    v1Desc: string;
    v1Tag: string;
    v2Title: string;
    v2Desc: string;
    v2Tag: string;
    v3Title: string;
    v3Desc: string;
    v3Tag: string;
  };

  // ── Demo Modal ───────────────────────────────────────────
  demoModal: {
    modalTitle: string;
    modalDesc: string;
    pause: string;
    playDemo: string;
    prev: string;
    next: string;
    done: string;
  };

  // ── CTA Section ───────────────────────────────────────────
  cta: {
    badge: string;
    heading: string;
    headingGradient: string;
    description: string;
    ctaPrimary: string;
    ctaNote: string;
    features: string[];
    cardTitle: string;
    cardSubtitle: string;
    scanLabel: string;
    scanSub: string;
    emergencyContactLabel: string;
    bloodLabel: string;
    allergiesLabel: string;
    medicationsLabel: string;
  };

  // ── Footer ────────────────────────────────────────────────
  footer: {
    tagline: string;
    hotline: string;
    copyright: string;
    columns: {
      product: { title: string; links: string[] };
      company: { title: string; links: string[] };
      support: { title: string; links: string[] };
      legal: { title: string; links: string[] };
    };
    bottomLinks: { privacy: string; terms: string; cookies: string };
  };

  // ── Auth: Login ───────────────────────────────────────────
  login: {
    backToHome: string;
    heading: string;
    subheading: string;
    orEmail: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    rememberMe: string;
    signIn: string;
    signingIn: string;
    demoAccess: string;
    demoPasswordNote: string;
    noAccount: string;
    signUp: string;
    hipaaCompliant: string;
    encrypted: string;
    resetPasswordTitle: string;
    resetPasswordDesc: string;
    resetEmailLabel: string;
    cancel: string;
    sendResetLink: string;
    errorInvalidCredentials: string;
    errorEmail: string;
    errorPassword: string;
    tagline: string;
    taglineSub: string;
    statLivesSaved: string;
    statHospitalsOnline: string;
    statAmbulancesActive: string;
    statAvgResponse: string;
    testimonialQuote: string;
    testimonialAuthor: string;
    googleBtn: string;
    appleBtn: string;
  };

  // ── Auth: Signup ──────────────────────────────────────────
  signup: {
    backToHome: string;
    heading: string;
    subheading: string;
    alreadyHaveAccount: string;
    signIn: string;
    chooseRole: string;
    next: string;
    back: string;
    submit: string;
    submitting: string;
    successTitle: string;
    errorFix: string;
    errorNetwork: string;
    errorSignup: string;
    // Roles
    roles: {
      patient: { label: string; description: string; features: string[] };
      driver: { label: string; description: string; features: string[] };
      hospitalStaff: { label: string; description: string; features: string[] };
      admin: { label: string; description: string; features: string[] };
    };
    // Step labels
    steps: {
      account: string;
      accountDesc: string;
      medicalProfile: string;
      medicalProfileDesc: string;
      medicalHistory: string;
      medicalHistoryDesc: string;
      emergencyContact: string;
      emergencyContactDesc: string;
      driverDetails: string;
      driverDetailsDesc: string;
      hospitalRole: string;
      hospitalRoleDesc: string;
      verification: string;
      verificationDesc: string;
      confirm: string;
      confirmDesc: string;
    };
    // Form fields
    fields: {
      fullName: string;
      fullNamePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      password: string;
      passwordPlaceholder: string;
      confirmPassword: string;
      confirmPasswordPlaceholder: string;
      passwordStrengthWeak: string;
      passwordStrengthFair: string;
      passwordStrengthGood: string;
      passwordStrengthStrong: string;
      bloodGroup: string;
      selectBloodGroup: string;
      dateOfBirth: string;
      gender: string;
      selectGender: string;
      genderMale: string;
      genderFemale: string;
      genderNonBinary: string;
      genderPreferNot: string;
      address: string;
      addressOptional: string;
      addressPlaceholder: string;
      allergies: string;
      allergiesPlaceholder: string;
      medications: string;
      medicationsPlaceholder: string;
      chronicConditions: string;
      chronicConditionsPlaceholder: string;
      tagInputHint: string;
      emergencyName: string;
      emergencyNamePlaceholder: string;
      emergencyRelationship: string;
      selectRelationship: string;
      emergencyPhone: string;
      emergencyPhonePlaceholder: string;
      licenseNumber: string;
      licenseNumberPlaceholder: string;
      experience: string;
      experiencePlaceholder: string;
      vehicleNumber: string;
      vehicleNumberPlaceholder: string;
      selectHospital: string;
      department: string;
      departmentPlaceholder: string;
      employeeId: string;
      employeeIdPlaceholder: string;
      adminCode: string;
      adminCodePlaceholder: string;
    };
    // Validation
    validation: {
      nameRequired: string;
      nameMinLength: string;
      emailRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      phoneInvalid: string;
      passwordRequired: string;
      passwordMinLength: string;
      confirmPasswordRequired: string;
      passwordMismatch: string;
      bloodGroupRequired: string;
      dobRequired: string;
      genderRequired: string;
      licenseRequired: string;
      experienceRequired: string;
      vehicleRequired: string;
      hospitalRequired: string;
      departmentRequired: string;
      adminCodeRequired: string;
    };
    medicalHistoryNote: string;
    emergencyContactNote: string;
    relationships: string[];
  };

  // ── Dashboard / Sidebar ───────────────────────────────────
  sidebar: {
    tagline: string;
    sectionMain: string;
    sectionEmergency: string;
    logout: string;
    collapse: string;
    expandSidebar: string;
    roleLabels: {
      patient: string;
      driver: string;
      hospitalStaff: string;
      admin: string;
    };
  };

  // ── Topbar ────────────────────────────────────────────────
  topbar: {
    search: string;
    searchShortcut: string;
    switchToLight: string;
    switchToDark: string;
    notifications: string;
    userMenu: string;
    profile: string;
    settings: string;
    logout: string;
  };

  // ── Common ────────────────────────────────────────────────
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    submit: string;
    close: string;
    confirm: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    noData: string;
    viewAll: string;
    learnMore: string;
    back: string;
    next: string;
    previous: string;
    optional: string;
    required: string;
  };
}

// ============================================================
// ENGLISH
// ============================================================
const en: Translations = {
  meta: {
    langName: "English",
    langNameNative: "English",
    dir: "ltr",
  },

  nav: {
    home: "Home",
    features: "Features",
    howItWorks: "How It Works",
    about: "About",
    contact: "Contact",
    login: "Login",
    getStarted: "Get Started",
    language: "Language",
  },

  hero: {
    badge: "Emergency Response · Reimagined",
    headline1: "EVERY",
    headline2: "SECOND",
    headline3: "MATTERS.",
    description:
      "One tap. GPS precision. Smart hospital matching. Real-time ambulance tracking.",
    descriptionHighlight: "Life-saving technology in your pocket.",
    ctaPrimary: "Get Emergency Card Free",
    ctaSecondary: "Watch Demo",
    trustHipaa: "HIPAA Compliant",
    trustActive: "24/7 Active",
    trustRealtime: "Real-time",
    scrollLabel: "Scroll",
    phoneLabel: "LifeLink",
    phoneHold: "Hold 2s for Emergency",
    phoneGpsStatus: "GPS Active · 108 Ready",
    phoneProfileLabel: "Your Emergency Profile",
    statLivesSaved: "Lives Saved",
    statHospitals: "Hospitals",
    statResponse: "Avg Response",
    statUptime: "Uptime",
    ticker: [
      "🚑 Ambulance dispatched in 47s — Mumbai",
      "✅ Patient admitted at AIIMS — Delhi",
      "🏥 4 beds cleared — Bangalore",
      "⚡ 3.8 min average response time",
      "🚑 Ambulance en route — Chennai",
      "✅ Emergency resolved — Pune",
      "❤️ 50,000+ lives saved this year",
      "🛡️ HIPAA compliant & encrypted",
    ],
  },

  features: {
    badge: "Built for Emergencies",
    heading: "Everything you need",
    headingGradient: "when seconds count.",
    subheading:
      "Six precision-engineered features that orchestrate every moment from SOS tap to hospital admission.",
    learnMore: "Learn more",
    items: {
      sos: {
        title: "Instant SOS",
        description:
          "One-tap emergency alert shares your GPS with responders and contacts in under 2 seconds.",
      },
      hospital: {
        title: "Smart Hospital Match",
        description:
          "AI matches you to the nearest hospital by specialty, real-time availability, and traffic.",
      },
      tracking: {
        title: "Live Tracking",
        description:
          "Real-time ambulance position on a live map — know exactly when help arrives.",
      },
      qrCard: {
        title: "Medical QR Card",
        description:
          "Blood type, allergies, medications — your full profile accessible via one QR scan.",
      },
      aiTriage: {
        title: "AI Triage",
        description:
          "Instant severity assessment routes your emergency to the right resources automatically.",
      },
      familyAlerts: {
        title: "Family Alerts",
        description:
          "Loved ones get live updates: location, hospital ETA, and status — all automatic.",
      },
    },
  },

  howItWorks: {
    badge: "How It Works",
    heading: "From SOS to",
    headingGradient: "Care in Minutes",
    subheading:
      "Six simple steps connecting you to life-saving care when every second counts.",
    steps: {
      step1: {
        title: "Press SOS",
        description:
          "Tap the SOS button to trigger an emergency alert instantly.",
      },
      step2: {
        title: "GPS Capture",
        description:
          "Your precise location is captured and shared with responders.",
      },
      step3: {
        title: "Ambulance Assigned",
        description: "The nearest available ambulance is dispatched to you.",
      },
      step4: {
        title: "Live Tracking",
        description: "Track the ambulance in real-time with ETA updates.",
      },
      step5: {
        title: "Hospital Ready",
        description:
          "The hospital prepares for your arrival with your medical data.",
      },
      step6: {
        title: "QR Scan at Arrival",
        description:
          "Your QR card provides instant access to your full medical profile.",
      },
    },
  },

  stats: {
    badge: "Live Network",
    heading: "Numbers that",
    headingGradient: "save lives.",
    subheading:
      "Real-time metrics from our emergency response network across 200+ cities.",
    activeEmergencies: "Active Emergencies Today",
    hospitalsOnline: "Hospitals Online",
    avgResponse: "Average Response Time",
    satisfaction: "Patient Satisfaction",
  },

  testimonials: {
    badge: "Testimonials",
    heading: "Real Stories,",
    headingGradient: "Real Lives Saved",
    subheading:
      "Hear from the people whose lives were changed by LifeLink's emergency response system.",
    items: {
      priya: {
        role: "Diabetic Patient, Mumbai",
        text: "I had a severe hypoglycemic episode while traveling alone. LifeLink detected my condition through my medical profile and alerted the nearest hospital. The ambulance arrived in under 3 minutes. This app literally saved my life.",
      },
      rajesh: {
        role: "Heart Patient, Delhi",
        text: "When I felt chest pain during my morning walk, I pressed SOS. Within seconds, my wife received an alert and an ambulance was dispatched. The hospital had my ECG history ready before I arrived. Incredible technology.",
      },
      ananya: {
        role: "Mother of Two, Bangalore",
        text: "My son had an allergic reaction at a park. The QR card let paramedics instantly know about his peanut allergy and medication. They treated him immediately. As a parent, this gives me such peace of mind.",
      },
    },
  },

  liveFeed: {
    badge: "Live Network Activity",
    heading: "Our network",
    headingGradient: "never sleeps.",
    description: "Across 200+ cities, LifeLink coordinates thousands of emergency responses 24/7 — connecting patients with the right care in under 4 minutes on average.",
    statActive: "Active now",
    statAmbulances: "Ambulances online",
    statHospitals: "Hospitals linked",
    feedHeader: "Live Emergency Feed",
    liveBadge: "LIVE",
    feedFooter: "Showing live events across India · Updated in real-time",
  },

  videoShowcase: {
    badge: "See It In Action",
    heading: "Watch how we're",
    headingGradient: "saving lives",
    subheading: "Real stories. Real technology. See how LifeLink works from first tap to hospital admission.",
    v1Title: "How Emergency Response Works",
    v1Desc: "See how LifeLink connects patients with ambulances and hospitals in real-time during a medical emergency.",
    v1Tag: "How It Works",
    v2Title: "Ambulance Dispatch Technology",
    v2Desc: "Explore the AI-powered dispatch system that assigns the nearest ambulance within seconds.",
    v2Tag: "Technology",
    v3Title: "Patient Safety & Privacy",
    v3Desc: "Your medical data is encrypted and only shared with authorized healthcare providers.",
    v3Tag: "Security",
  },

  demoModal: {
    modalTitle: "LifeLink Interactive Demo",
    modalDesc: "Experience how LifeLink orchestrates every step of emergency medical response",
    pause: "Pause Demo",
    playDemo: "Play Demo",
    prev: "Previous",
    next: "Next Step",
    done: "Close Demo",
  },

  cta: {
    badge: "Get Your Card",
    heading: "Your Medical Emergency Card,",
    headingGradient: "Always Ready",
    description:
      "Create your free digital medical ID card in under 2 minutes. It stores your blood type, allergies, medications, and emergency contacts — accessible instantly via QR code.",
    ctaPrimary: "Sign Up Free",
    ctaNote: "No credit card required",
    features: [
      "Instant QR code generation",
      "Offline access always works",
      "Shareable with family",
      "HIPAA compliant & encrypted",
    ],
    cardTitle: "Medical ID",
    cardSubtitle: "LifeLink",
    scanLabel: "Scan for Full Profile",
    scanSub: "Emergency contacts & medical history",
    emergencyContactLabel: "Emergency Contact",
    bloodLabel: "Blood",
    allergiesLabel: "Allergies",
    medicationsLabel: "Medications",
  },

  footer: {
    tagline:
      "Every second matters. LifeLink connects patients with hospitals and ambulances in real-time, powered by AI and built for emergencies.",
    hotline: "Emergency Hotline: 108 — Available 24/7",
    copyright: "LifeLink Technologies Inc. All rights reserved.",
    columns: {
      product: {
        title: "Product",
        links: [
          "Features",
          "Pricing",
          "Integrations",
          "Mobile App",
          "API Docs",
        ],
      },
      company: {
        title: "Company",
        links: ["About Us", "Careers", "Blog", "Press", "Partners"],
      },
      support: {
        title: "Support",
        links: [
          "Help Center",
          "Contact Us",
          "System Status",
          "Community",
          "Training",
        ],
      },
      legal: {
        title: "Legal",
        links: [
          "Privacy Policy",
          "Terms of Service",
          "Compliance",
          "Cookie Policy",
          "GDPR",
        ],
      },
    },
    bottomLinks: { privacy: "Privacy", terms: "Terms", cookies: "Cookies" },
  },

  login: {
    backToHome: "Back to Home",
    heading: "Sign In",
    subheading: "Enter your credentials to access your account",
    orEmail: "or continue with email",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember me for 30 days",
    signIn: "Sign In",
    signingIn: "Signing in...",
    demoAccess: "Quick Demo Access",
    demoPasswordNote: "Password is pre-filled:",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    hipaaCompliant: "HIPAA Compliant",
    encrypted: "256-bit Encrypted",
    resetPasswordTitle: "Reset Password",
    resetPasswordDesc:
      "Enter your email address and we'll send you a link to reset your password.",
    resetEmailLabel: "Email Address",
    cancel: "Cancel",
    sendResetLink: "Send Reset Link",
    errorInvalidCredentials: "Invalid email or password",
    errorEmail: "Please enter your email address",
    errorPassword: "Please enter your password",
    tagline: "Every Second Matters",
    taglineSub: "Smart Emergency Medical Response System",
    statLivesSaved: "Lives Saved",
    statHospitalsOnline: "Hospitals Online",
    statAmbulancesActive: "Ambulances Active",
    statAvgResponse: "Avg Response (min)",
    testimonialQuote:
      '"LifeLink saved my father\'s life. The ambulance arrived in under 4 minutes."',
    testimonialAuthor: "— Priya M., Verified Patient",
    googleBtn: "Google",
    appleBtn: "Apple",
  },

  signup: {
    backToHome: "Back to Home",
    heading: "Join LifeLink",
    subheading:
      "Choose your role to get started with a personalized experience tailored to your needs.",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    chooseRole: "Choose your role",
    next: "Continue",
    back: "Back",
    submit: "Create Account",
    submitting: "Creating Account...",
    successTitle: "Account Created!",
    errorFix: "Please fix the errors before continuing",
    errorNetwork: "Network error. Please check your connection.",
    errorSignup: "Signup failed. Please try again.",
    roles: {
      patient: {
        label: "Patient",
        description:
          "Access emergency services, track ambulances, manage your health profile",
        features: [
          "SOS Emergency Button",
          "Real-time Ambulance Tracking",
          "Medical Records",
          "AI Health Assistant",
        ],
      },
      driver: {
        label: "Ambulance Driver",
        description:
          "Manage emergency assignments, track your vehicle, update your availability",
        features: [
          "Emergency Assignments",
          "Live Navigation",
          "Earnings Dashboard",
          "Vehicle Management",
        ],
      },
      hospitalStaff: {
        label: "Hospital Staff",
        description:
          "Manage emergency queue, patient intake, and hospital resources",
        features: [
          "Emergency Queue",
          "Patient Intake",
          "Bed Management",
          "Resource Tracking",
        ],
      },
      admin: {
        label: "Administrator",
        description:
          "Full access to LifeLink management console and system oversight",
        features: [
          "System Management",
          "User Administration",
          "Analytics & Reports",
          "Full Console Access",
        ],
      },
    },
    steps: {
      account: "Account",
      accountDesc: "Create your personal account credentials",
      medicalProfile: "Medical Profile",
      medicalProfileDesc: "Add your basic medical information",
      medicalHistory: "Medical History",
      medicalHistoryDesc: "List allergies, medications & conditions",
      emergencyContact: "Emergency Contact",
      emergencyContactDesc: "Who should we contact in emergencies?",
      driverDetails: "Driver Details",
      driverDetailsDesc: "License, experience & vehicle information",
      hospitalRole: "Hospital & Role",
      hospitalRoleDesc: "Select your hospital and department",
      verification: "Verification",
      verificationDesc: "Enter your admin invitation code",
      confirm: "Confirm",
      confirmDesc: "Review and submit your profile",
    },
    fields: {
      fullName: "Full Name",
      fullNamePlaceholder: "John Doe",
      email: "Email Address",
      emailPlaceholder: "you@example.com",
      phone: "Phone Number",
      phonePlaceholder: "+91-9876543210",
      password: "Password",
      passwordPlaceholder: "Min. 8 characters",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter password",
      passwordStrengthWeak: "Weak",
      passwordStrengthFair: "Fair",
      passwordStrengthGood: "Good",
      passwordStrengthStrong: "Strong",
      bloodGroup: "Blood Group",
      selectBloodGroup: "Select blood group",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      selectGender: "Select gender",
      genderMale: "Male",
      genderFemale: "Female",
      genderNonBinary: "Non-binary",
      genderPreferNot: "Prefer not to say",
      address: "Home Address",
      addressOptional: "(optional)",
      addressPlaceholder: "Enter your home address",
      allergies: "Allergies",
      allergiesPlaceholder: "e.g. Penicillin, Peanuts, Latex",
      medications: "Current Medications",
      medicationsPlaceholder: "e.g. Metformin 500mg, Aspirin",
      chronicConditions: "Chronic Conditions",
      chronicConditionsPlaceholder: "e.g. Diabetes, Hypertension",
      tagInputHint: "Press Enter or comma to add each item",
      emergencyName: "Contact Name",
      emergencyNamePlaceholder: "Jane Doe",
      emergencyRelationship: "Relationship",
      selectRelationship: "Select relationship",
      emergencyPhone: "Contact Phone",
      emergencyPhonePlaceholder: "+91-9876543210",
      licenseNumber: "License Number",
      licenseNumberPlaceholder: "DL-0420110012345",
      experience: "Years of Experience",
      experiencePlaceholder: "e.g. 5",
      vehicleNumber: "Vehicle Number",
      vehicleNumberPlaceholder: "DL-01-EM-0012",
      selectHospital: "Select your hospital",
      department: "Department",
      departmentPlaceholder: "e.g. Emergency, ICU",
      employeeId: "Employee ID",
      employeeIdPlaceholder: "EMP-12345",
      adminCode: "Admin Invite Code",
      adminCodePlaceholder: "Enter invitation code",
    },
    validation: {
      nameRequired: "Full name is required",
      nameMinLength: "Name must be at least 2 characters",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Please enter a valid phone number",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 8 characters",
      confirmPasswordRequired: "Please confirm your password",
      passwordMismatch: "Passwords do not match",
      bloodGroupRequired: "Please select your blood group",
      dobRequired: "Please enter your date of birth",
      genderRequired: "Please select your gender",
      licenseRequired: "License number is required",
      experienceRequired: "Years of experience is required",
      vehicleRequired: "Vehicle number is required",
      hospitalRequired: "Please select your hospital",
      departmentRequired: "Department is required",
      adminCodeRequired: "Admin invite code is required",
    },
    medicalHistoryNote:
      "This helps emergency responders provide better care. All fields are optional — add as much or as little as you want.",
    emergencyContactNote:
      "Optional but highly recommended. We'll notify this person during emergencies when you can't communicate.",
    relationships: ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"],
  },

  sidebar: {
    tagline: "Every Second Matters",
    sectionMain: "Main",
    sectionEmergency: "Emergency",
    logout: "Logout",
    collapse: "Collapse",
    expandSidebar: "Expand Sidebar",
    roleLabels: {
      patient: "Patient",
      driver: "Ambulance Driver",
      hospitalStaff: "Hospital Staff",
      admin: "Administrator",
    },
  },

  topbar: {
    search: "Search...",
    searchShortcut: "⌘K",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    notifications: "Notifications",
    userMenu: "User menu",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
  },

  common: {
    loading: "Loading...",
    error: "Something went wrong",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    submit: "Submit",
    close: "Close",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    noData: "No data available",
    viewAll: "View All",
    learnMore: "Learn More",
    back: "Back",
    next: "Next",
    previous: "Previous",
    optional: "optional",
    required: "required",
  },
};

// ============================================================
// BENGALI (বাংলা)
// ============================================================
const bn: Translations = {
  meta: {
    langName: "Bengali",
    langNameNative: "বাংলা",
    dir: "ltr",
  },

  nav: {
    home: "হোম",
    features: "বৈশিষ্ট্য",
    howItWorks: "কীভাবে কাজ করে",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    login: "লগইন",
    getStarted: "শুরু করুন",
    language: "ভাষা",
  },

  hero: {
    badge: "জরুরি সাড়া · নতুনভাবে",
    headline1: "প্রতিটি",
    headline2: "মুহূর্ত",
    headline3: "গুরুত্বপূর্ণ।",
    description:
      "এক ট্যাপ। GPS নির্ভুলতা। স্মার্ট হাসপাতাল মিলান। রিয়েল-টাইম অ্যাম্বুলেন্স ট্র্যাকিং।",
    descriptionHighlight: "আপনার পকেটে জীবন রক্ষাকারী প্রযুক্তি।",
    ctaPrimary: "বিনামূল্যে জরুরি কার্ড পান",
    ctaSecondary: "ডেমো দেখুন",
    trustHipaa: "HIPAA সম্মত",
    trustActive: "২৪/৭ সক্রিয়",
    trustRealtime: "রিয়েল-টাইম",
    scrollLabel: "স্ক্রোল করুন",
    phoneLabel: "LifeLink",
    phoneHold: "জরুরি অবস্থার জন্য ২ সেকেন্ড ধরুন",
    phoneGpsStatus: "GPS সক্রিয় · ১০৮ প্রস্তুত",
    phoneProfileLabel: "আপনার জরুরি প্রোফাইল",
    statLivesSaved: "জীবন বাঁচানো হয়েছে",
    statHospitals: "হাসপাতাল",
    statResponse: "গড় সাড়া",
    statUptime: "আপটাইম",
    ticker: [
      "🚑 ৪৭ সেকেন্ডে অ্যাম্বুলেন্স রওনা — মুম্বাই",
      "✅ এইমস জরুরি বিভাগে রোগী ভর্তি — দিল্লি",
      "🏥 ৪টি বেড প্রস্তুত — বেঙ্গালুরু",
      "⚡ ৩.৮ মিনিট গড় সাড়ার সময়",
      "🚑 অ্যাম্বুলেন্স পথে রয়েছে — চেন্নাই",
      "✅ জরুরি অবস্থা সমাধান হয়েছে — পুনে",
      "❤️ এ বছর ৫০,০০০+ জীবন রক্ষা করা হয়েছে",
      "🛡️ HIPAA সার্টিফাইড এবং এনক্রিপ্ট করা",
    ],
  },

  features: {
    badge: "জরুরি অবস্থার জন্য তৈরি",
    heading: "আপনার যা দরকার সব",
    headingGradient: "যখন প্রতিটি সেকেন্ড গুরুত্বপূর্ণ।",
    subheading:
      "ছয়টি নির্ভুল বৈশিষ্ট্য যা SOS থেকে হাসপাতাল ভর্তি পর্যন্ত প্রতিটি মুহূর্ত পরিচালনা করে।",
    learnMore: "আরও জানুন",
    items: {
      sos: {
        title: "তাৎক্ষণিক SOS",
        description:
          "এক-ট্যাপ জরুরি সতর্কতা ২ সেকেন্ডেরও কম সময়ে আপনার GPS উদ্ধারকারী ও পরিচিতদের সাথে শেয়ার করে।",
      },
      hospital: {
        title: "স্মার্ট হাসপাতাল মিলান",
        description:
          "AI বিশেষত্ব, রিয়েল-টাইম প্রাপ্যতা এবং ট্র্যাফিক অনুযায়ী নিকটতম হাসপাতাল খুঁজে দেয়।",
      },
      tracking: {
        title: "লাইভ ট্র্যাকিং",
        description:
          "লাইভ ম্যাপে রিয়েল-টাইম অ্যাম্বুলেন্সের অবস্থান — ঠিক কখন সাহায্য আসবে জানুন।",
      },
      qrCard: {
        title: "মেডিক্যাল QR কার্ড",
        description:
          "রক্তের ধরন, অ্যালার্জি, ওষুধ — একটি QR স্ক্যানে আপনার সম্পূর্ণ প্রোফাইল।",
      },
      aiTriage: {
        title: "AI ট্রাইয়েজ",
        description:
          "তাৎক্ষণিক তীব্রতা মূল্যায়ন স্বয়ংক্রিয়ভাবে আপনার জরুরি অবস্থা সঠিক সংস্থানে পাঠায়।",
      },
      familyAlerts: {
        title: "পরিবারের সতর্কতা",
        description:
          "প্রিয়জনরা লাইভ আপডেট পায়: অবস্থান, হাসপাতাল ETA, এবং স্ট্যাটাস — সবই স্বয়ংক্রিয়।",
      },
    },
  },

  howItWorks: {
    badge: "কীভাবে কাজ করে",
    heading: "SOS থেকে",
    headingGradient: "মিনিটের মধ্যে চিকিৎসা",
    subheading:
      "ছয়টি সহজ ধাপ যা আপনাকে জীবন রক্ষাকারী চিকিৎসার সাথে সংযুক্ত করে।",
    steps: {
      step1: {
        title: "SOS চাপুন",
        description: "তাৎক্ষণিক জরুরি সতর্কতা চালু করতে SOS বোতাম ট্যাপ করুন।",
      },
      step2: {
        title: "GPS ক্যাপচার",
        description:
          "আপনার সঠিক অবস্থান ক্যাপচার করে উদ্ধারকারীদের সাথে শেয়ার করা হয়।",
      },
      step3: {
        title: "অ্যাম্বুলেন্স নিযুক্ত",
        description: "নিকটতম উপলব্ধ অ্যাম্বুলেন্স আপনার কাছে পাঠানো হয়।",
      },
      step4: {
        title: "লাইভ ট্র্যাকিং",
        description: "ETA আপডেট সহ রিয়েল-টাইমে অ্যাম্বুলেন্স ট্র্যাক করুন।",
      },
      step5: {
        title: "হাসপাতাল প্রস্তুত",
        description:
          "হাসপাতাল আপনার মেডিক্যাল ডেটা দিয়ে আগমনের জন্য প্রস্তুত হয়।",
      },
      step6: {
        title: "আগমনে QR স্ক্যান",
        description:
          "আপনার QR কার্ড আপনার সম্পূর্ণ মেডিক্যাল প্রোফাইলে তাৎক্ষণিক অ্যাক্সেস দেয়।",
      },
    },
  },

  stats: {
    badge: "লাইভ নেটওয়ার্ক",
    heading: "সংখ্যা যা",
    headingGradient: "জীবন বাঁচায়।",
    subheading:
      "২০০+ শহর জুড়ে আমাদের জরুরি সাড়া নেটওয়ার্ক থেকে রিয়েল-টাইম মেট্রিক্স।",
    activeEmergencies: "আজকের সক্রিয় জরুরি অবস্থা",
    hospitalsOnline: "হাসপাতাল অনলাইন",
    avgResponse: "গড় সাড়া সময়",
    satisfaction: "রোগীর সন্তুষ্টি",
  },

  testimonials: {
    badge: "প্রশংসাপত্র",
    heading: "বাস্তব গল্প,",
    headingGradient: "বাস্তব জীবন রক্ষা",
    subheading:
      "যাদের জীবন LifeLink-এর জরুরি সাড়া সিস্টেম পরিবর্তন করেছে তাদের কথা শুনুন।",
    items: {
      priya: {
        role: "ডায়াবেটিক রোগী, মুম্বাই",
        text: "একা ভ্রমণের সময় আমার তীব্র হাইপোগ্লাইসেমিক এপিসোড হয়। LifeLink আমার মেডিক্যাল প্রোফাইলের মাধ্যমে অবস্থা শনাক্ত করে নিকটতম হাসপাতালকে সতর্ক করে। ৩ মিনিটেরও কম সময়ে অ্যাম্বুলেন্স এসেছিল। এই অ্যাপটি সত্যিই আমার জীবন বাঁচিয়েছে।",
      },
      rajesh: {
        role: "হার্টের রোগী, দিল্লি",
        text: "সকালের হাঁটার সময় বুকে ব্যথা অনুভব করে SOS চাপলাম। সেকেন্ডের মধ্যে আমার স্ত্রী সতর্কতা পেল এবং অ্যাম্বুলেন্স পাঠানো হলো। হাসপাতাল আসার আগেই আমার ECG ইতিহাস প্রস্তুত ছিল। অসাধারণ প্রযুক্তি।",
      },
      ananya: {
        role: "দুই সন্তানের মা, ব্যাঙ্গালোর",
        text: "পার্কে আমার ছেলের অ্যালার্জিক প্রতিক্রিয়া হয়। QR কার্ড প্যারামেডিক্সকে তাৎক্ষণিকভাবে তার বাদাম অ্যালার্জি ও ওষুধ সম্পর্কে জানাল। তারা তৎক্ষণাৎ চিকিৎসা করল। একজন বাবা-মা হিসেবে এটা আমাকে অনেক মানসিক শান্তি দেয়।",
      },
    },
  },

  liveFeed: {
    badge: "লাইভ নেটওয়ার্ক কার্যক্রম",
    heading: "আমাদের নেটওয়ার্ক",
    headingGradient: "কখনই ঘুমায় না।",
    description: "২০০টিরও বেশি শহরে, লাইফলিংক ২৪/৭ হাজার হাজার জরুরি সাড়া সমন্বয় করে — রোগীদের গড়ে ৪ মিনিটের কম সময়ে সঠিক চিকিৎসার সাথে যুক্ত করে।",
    statActive: "এখন সক্রিয়",
    statAmbulances: "অনলাইন অ্যাম্বুলেন্স",
    statHospitals: "সংযুক্ত হাসপাতাল",
    feedHeader: "লাইভ ইমার্জেন্সি ফিড",
    liveBadge: "লাইভ",
    feedFooter: "সমগ্র ভারতের লাইভ ইভেন্ট দেখানো হচ্ছে · রিয়েল-টাইমে আপডেট",
  },

  videoShowcase: {
    badge: "কার্যক্রম দেখুন",
    heading: "দেখুন কিভাবে আমরা",
    headingGradient: "জীবন বাঁচাচ্ছি",
    subheading: "বাস্তব গল্প। বাস্তব প্রযুক্তি। প্রথম ট্যাপ থেকে হাসপাতালে ভর্তি হওয়া পর্যন্ত লাইফলিংক কীভাবে কাজ করে তা দেখুন।",
    v1Title: "জরুরি সাড়া কীভাবে কাজ করে",
    v1Desc: "মেডিকেল ইমার্জেন্সির সময় লাইফলিংক কীভাবে রিয়েল-টাইমে রোগী, অ্যাম্বুলেন্স এবং হাসপাতালকে সংযুক্ত করে দেখুন।",
    v1Tag: "কীভাবে কাজ করে",
    v2Title: "অ্যাম্বুলেন্স ডিসপ্যাচ প্রযুক্তি",
    v2Desc: "এআই-চালিত ডিসপ্যাচ সিস্টেমটি কীভাবে সেকেন্ডের মধ্যে নিকটতম অ্যাম্বুলেন্স নির্ধারণ করে তা জানুন।",
    v2Tag: "প্রযুক্তি",
    v3Title: "রোগীর নিরাপত্তা ও গোপনীয়তা",
    v3Desc: "আপনার চিকিৎসা সংক্রান্ত তথ্য এনক্রিপ্ট করা থাকে এবং শুধুমাত্র অনুমোদিত স্বাস্থ্যসেবা প্রদানকারীদের সাথে শেয়ার করা হয়।",
    v3Tag: "নিরাপত্তা",
  },

  demoModal: {
    modalTitle: "লাইফলিংক ইন্টারেক্টিভ ডেমো",
    modalDesc: "লাইফলিংক কীভাবে জরুরি চিকিৎসা সাড়ার প্রতিটি ধাপ পরিচালনা করে তা অনুভব করুন",
    pause: "ডেমো বিরতি দিন",
    playDemo: "ডেমো চালান",
    prev: "পূর্ববর্তী",
    next: "পরবর্তী ধাপ",
    done: "ডেমো বন্ধ করুন",
  },

  cta: {
    badge: "আপনার কার্ড নিন",
    heading: "আপনার মেডিক্যাল জরুরি কার্ড,",
    headingGradient: "সবসময় প্রস্তুত",
    description:
      "২ মিনিটেরও কম সময়ে আপনার বিনামূল্যে ডিজিটাল মেডিক্যাল ID কার্ড তৈরি করুন। এটি আপনার রক্তের ধরন, অ্যালার্জি, ওষুধ এবং জরুরি পরিচিতি সংরক্ষণ করে — QR কোডের মাধ্যমে তাৎক্ষণিকভাবে অ্যাক্সেসযোগ্য।",
    ctaPrimary: "বিনামূল্যে সাইন আপ করুন",
    ctaNote: "ক্রেডিট কার্ডের প্রয়োজন নেই",
    features: [
      "তাৎক্ষণিক QR কোড তৈরি",
      "অফলাইনেও সবসময় কাজ করে",
      "পরিবারের সাথে শেয়ার করা যায়",
      "HIPAA সম্মত ও এনক্রিপ্টেড",
    ],
    cardTitle: "মেডিক্যাল ID",
    cardSubtitle: "LifeLink",
    scanLabel: "সম্পূর্ণ প্রোফাইলের জন্য স্ক্যান করুন",
    scanSub: "জরুরি পরিচিতি ও মেডিক্যাল ইতিহাস",
    emergencyContactLabel: "জরুরি যোগাযোগ",
    bloodLabel: "রক্ত",
    allergiesLabel: "অ্যালার্জি",
    medicationsLabel: "ওষুধ",
  },

  footer: {
    tagline:
      "প্রতিটি মুহূর্ত গুরুত্বপূর্ণ। LifeLink রোগীদের হাসপাতাল ও অ্যাম্বুলেন্সের সাথে রিয়েল-টাইমে সংযুক্ত করে, AI দ্বারা চালিত এবং জরুরি অবস্থার জন্য তৈরি।",
    hotline: "জরুরি হটলাইন: ১০৮ — ২৪/৭ উপলব্ধ",
    copyright: "LifeLink Technologies Inc. সমস্ত অধিকার সংরক্ষিত।",
    columns: {
      product: {
        title: "পণ্য",
        links: [
          "বৈশিষ্ট্য",
          "মূল্য নির্ধারণ",
          "ইন্টিগ্রেশন",
          "মোবাইল অ্যাপ",
          "API ডকস",
        ],
      },
      company: {
        title: "কোম্পানি",
        links: ["আমাদের সম্পর্কে", "ক্যারিয়ার", "ব্লগ", "প্রেস", "অংশীদার"],
      },
      support: {
        title: "সহায়তা",
        links: [
          "সহায়তা কেন্দ্র",
          "যোগাযোগ করুন",
          "সিস্টেম স্ট্যাটাস",
          "কমিউনিটি",
          "প্রশিক্ষণ",
        ],
      },
      legal: {
        title: "আইনি",
        links: [
          "গোপনীয়তা নীতি",
          "সেবার শর্তাবলী",
          "সম্মতি",
          "কুকি নীতি",
          "GDPR",
        ],
      },
    },
    bottomLinks: { privacy: "গোপনীয়তা", terms: "শর্তাবলী", cookies: "কুকিজ" },
  },

  login: {
    backToHome: "হোমে ফিরুন",
    heading: "সাইন ইন",
    subheading: "আপনার অ্যাকাউন্ট অ্যাক্সেস করতে তথ্য দিন",
    orEmail: "বা ইমেইল দিয়ে চালিয়ে যান",
    emailLabel: "ইমেইল",
    emailPlaceholder: "you@example.com",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "আপনার পাসওয়ার্ড দিন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    rememberMe: "৩০ দিনের জন্য মনে রাখুন",
    signIn: "সাইন ইন",
    signingIn: "সাইন ইন হচ্ছে...",
    demoAccess: "দ্রুত ডেমো অ্যাক্সেস",
    demoPasswordNote: "পাসওয়ার্ড পূর্বে পূরণ করা:",
    noAccount: "অ্যাকাউন্ট নেই?",
    signUp: "সাইন আপ",
    hipaaCompliant: "HIPAA সম্মত",
    encrypted: "২৫৬-বিট এনক্রিপ্টেড",
    resetPasswordTitle: "পাসওয়ার্ড রিসেট",
    resetPasswordDesc:
      "আপনার ইমেইল ঠিকানা দিন এবং আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব।",
    resetEmailLabel: "ইমেইল ঠিকানা",
    cancel: "বাতিল",
    sendResetLink: "রিসেট লিংক পাঠান",
    errorInvalidCredentials: "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
    errorEmail: "আপনার ইমেইল ঠিকানা দিন",
    errorPassword: "আপনার পাসওয়ার্ড দিন",
    tagline: "প্রতিটি মুহূর্ত গুরুত্বপূর্ণ",
    taglineSub: "স্মার্ট জরুরি চিকিৎসা সাড়া সিস্টেম",
    statLivesSaved: "জীবন বাঁচানো হয়েছে",
    statHospitalsOnline: "হাসপাতাল অনলাইন",
    statAmbulancesActive: "অ্যাম্বুলেন্স সক্রিয়",
    statAvgResponse: "গড় সাড়া (মিনিট)",
    testimonialQuote:
      '"LifeLink আমার বাবার জীবন বাঁচিয়েছে। অ্যাম্বুলেন্স ৪ মিনিটেরও কম সময়ে এসেছিল।"',
    testimonialAuthor: "— প্রিয়া এম., যাচাইকৃত রোগী",
    googleBtn: "Google",
    appleBtn: "Apple",
  },

  signup: {
    backToHome: "হোমে ফিরুন",
    heading: "LifeLink-এ যোগ দিন",
    subheading:
      "আপনার প্রয়োজন অনুযায়ী ব্যক্তিগতকৃত অভিজ্ঞতা শুরু করতে আপনার ভূমিকা বেছে নিন।",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    signIn: "সাইন ইন",
    chooseRole: "আপনার ভূমিকা বেছে নিন",
    next: "পরবর্তী",
    back: "পিছনে",
    submit: "অ্যাকাউন্ট তৈরি করুন",
    submitting: "অ্যাকাউন্ট তৈরি হচ্ছে...",
    successTitle: "অ্যাকাউন্ট তৈরি হয়েছে!",
    errorFix: "চালিয়ে যাওয়ার আগে ত্রুটিগুলি ঠিক করুন",
    errorNetwork: "নেটওয়ার্ক ত্রুটি। আপনার সংযোগ পরীক্ষা করুন।",
    errorSignup: "সাইন আপ ব্যর্থ। আবার চেষ্টা করুন।",
    roles: {
      patient: {
        label: "রোগী",
        description:
          "জরুরি সেবা অ্যাক্সেস করুন, অ্যাম্বুলেন্স ট্র্যাক করুন, স্বাস্থ্য প্রোফাইল পরিচালনা করুন",
        features: [
          "SOS জরুরি বোতাম",
          "রিয়েল-টাইম অ্যাম্বুলেন্স ট্র্যাকিং",
          "মেডিক্যাল রেকর্ড",
          "AI স্বাস্থ্য সহকারী",
        ],
      },
      driver: {
        label: "অ্যাম্বুলেন্স চালক",
        description:
          "জরুরি অ্যাসাইনমেন্ট পরিচালনা করুন, আপনার গাড়ি ট্র্যাক করুন, প্রাপ্যতা আপডেট করুন",
        features: [
          "জরুরি অ্যাসাইনমেন্ট",
          "লাইভ নেভিগেশন",
          "আয় ড্যাশবোর্ড",
          "গাড়ি ব্যবস্থাপনা",
        ],
      },
      hospitalStaff: {
        label: "হাসপাতাল কর্মী",
        description: "জরুরি কিউ, রোগী ভর্তি এবং হাসপাতাল সংস্থান পরিচালনা করুন",
        features: [
          "জরুরি কিউ",
          "রোগী ভর্তি",
          "বেড ব্যবস্থাপনা",
          "রিসোর্স ট্র্যাকিং",
        ],
      },
      admin: {
        label: "প্রশাসক",
        description:
          "LifeLink ম্যানেজমেন্ট কনসোল এবং সিস্টেম তদারকিতে সম্পূর্ণ অ্যাক্সেস",
        features: [
          "সিস্টেম ব্যবস্থাপনা",
          "ব্যবহারকারী প্রশাসন",
          "বিশ্লেষণ ও রিপোর্ট",
          "সম্পূর্ণ কনসোল অ্যাক্সেস",
        ],
      },
    },
    steps: {
      account: "অ্যাকাউন্ট",
      accountDesc: "আপনার ব্যক্তিগত অ্যাকাউন্ট তথ্য তৈরি করুন",
      medicalProfile: "মেডিক্যাল প্রোফাইল",
      medicalProfileDesc: "আপনার মূল মেডিক্যাল তথ্য যোগ করুন",
      medicalHistory: "মেডিক্যাল ইতিহাস",
      medicalHistoryDesc: "অ্যালার্জি, ওষুধ ও অবস্থার তালিকা",
      emergencyContact: "জরুরি যোগাযোগ",
      emergencyContactDesc: "জরুরি অবস্থায় আমরা কাকে যোগাযোগ করব?",
      driverDetails: "চালকের বিবরণ",
      driverDetailsDesc: "লাইসেন্স, অভিজ্ঞতা ও গাড়ির তথ্য",
      hospitalRole: "হাসপাতাল ও ভূমিকা",
      hospitalRoleDesc: "আপনার হাসপাতাল এবং বিভাগ বেছে নিন",
      verification: "যাচাইকরণ",
      verificationDesc: "আপনার অ্যাডমিন আমন্ত্রণ কোড দিন",
      confirm: "নিশ্চিত করুন",
      confirmDesc: "আপনার প্রোফাইল পর্যালোচনা ও জমা দিন",
    },
    fields: {
      fullName: "পুরো নাম",
      fullNamePlaceholder: "রাহুল দাস",
      email: "ইমেইল ঠিকানা",
      emailPlaceholder: "you@example.com",
      phone: "ফোন নম্বর",
      phonePlaceholder: "+91-9876543210",
      password: "পাসওয়ার্ড",
      passwordPlaceholder: "কমপক্ষে ৮ অক্ষর",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      confirmPasswordPlaceholder: "পাসওয়ার্ড পুনরায় দিন",
      passwordStrengthWeak: "দুর্বল",
      passwordStrengthFair: "মাঝারি",
      passwordStrengthGood: "ভালো",
      passwordStrengthStrong: "শক্তিশালী",
      bloodGroup: "রক্তের গ্রুপ",
      selectBloodGroup: "রক্তের গ্রুপ বেছে নিন",
      dateOfBirth: "জন্ম তারিখ",
      gender: "লিঙ্গ",
      selectGender: "লিঙ্গ বেছে নিন",
      genderMale: "পুরুষ",
      genderFemale: "মহিলা",
      genderNonBinary: "নন-বাইনারি",
      genderPreferNot: "বলতে চাই না",
      address: "বাড়ির ঠিকানা",
      addressOptional: "(ঐচ্ছিক)",
      addressPlaceholder: "আপনার বাড়ির ঠিকানা দিন",
      allergies: "অ্যালার্জি",
      allergiesPlaceholder: "যেমন: পেনিসিলিন, বাদাম, লেটেক্স",
      medications: "বর্তমান ওষুধ",
      medicationsPlaceholder: "যেমন: মেটফর্মিন ৫০০মিগ্রা, অ্যাসপিরিন",
      chronicConditions: "দীর্ঘমেয়াদী রোগ",
      chronicConditionsPlaceholder: "যেমন: ডায়াবেটিস, উচ্চ রক্তচাপ",
      tagInputHint: "প্রতিটি আইটেম যোগ করতে Enter বা কমা চাপুন",
      emergencyName: "পরিচিতির নাম",
      emergencyNamePlaceholder: "পিয়া দাস",
      emergencyRelationship: "সম্পর্ক",
      selectRelationship: "সম্পর্ক বেছে নিন",
      emergencyPhone: "পরিচিতির ফোন",
      emergencyPhonePlaceholder: "+91-9876543210",
      licenseNumber: "লাইসেন্স নম্বর",
      licenseNumberPlaceholder: "DL-0420110012345",
      experience: "অভিজ্ঞতার বছর",
      experiencePlaceholder: "যেমন: ৫",
      vehicleNumber: "গাড়ির নম্বর",
      vehicleNumberPlaceholder: "WB-01-EM-0012",
      selectHospital: "আপনার হাসপাতাল বেছে নিন",
      department: "বিভাগ",
      departmentPlaceholder: "যেমন: জরুরি, ICU",
      employeeId: "কর্মচারী ID",
      employeeIdPlaceholder: "EMP-12345",
      adminCode: "অ্যাডমিন আমন্ত্রণ কোড",
      adminCodePlaceholder: "আমন্ত্রণ কোড দিন",
    },
    validation: {
      nameRequired: "পুরো নাম প্রয়োজন",
      nameMinLength: "নাম কমপক্ষে ২ অক্ষরের হতে হবে",
      emailRequired: "ইমেইল প্রয়োজন",
      emailInvalid: "একটি সঠিক ইমেইল দিন",
      phoneRequired: "ফোন নম্বর প্রয়োজন",
      phoneInvalid: "একটি সঠিক ফোন নম্বর দিন",
      passwordRequired: "পাসওয়ার্ড প্রয়োজন",
      passwordMinLength: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে",
      confirmPasswordRequired: "পাসওয়ার্ড নিশ্চিত করুন",
      passwordMismatch: "পাসওয়ার্ড মিলছে না",
      bloodGroupRequired: "আপনার রক্তের গ্রুপ বেছে নিন",
      dobRequired: "আপনার জন্ম তারিখ দিন",
      genderRequired: "আপনার লিঙ্গ বেছে নিন",
      licenseRequired: "লাইসেন্স নম্বর প্রয়োজন",
      experienceRequired: "অভিজ্ঞতার বছর প্রয়োজন",
      vehicleRequired: "গাড়ির নম্বর প্রয়োজন",
      hospitalRequired: "আপনার হাসপাতাল বেছে নিন",
      departmentRequired: "বিভাগ প্রয়োজন",
      adminCodeRequired: "অ্যাডমিন আমন্ত্রণ কোড প্রয়োজন",
    },
    medicalHistoryNote:
      "এটি জরুরি উদ্ধারকারীদের আরও ভালো সেবা দিতে সাহায্য করে। সব ক্ষেত্র ঐচ্ছিক — যতটুকু চান যোগ করুন।",
    emergencyContactNote:
      "ঐচ্ছিক তবে অত্যন্ত প্রস্তাবিত। যখন আপনি যোগাযোগ করতে পারবেন না তখন জরুরি অবস্থায় এই ব্যক্তিকে জানাব।",
    relationships: [
      "স্বামী/স্ত্রী",
      "বাবা-মা",
      "ভাই-বোন",
      "সন্তান",
      "বন্ধু",
      "অন্যান্য",
    ],
  },

  sidebar: {
    tagline: "প্রতিটি মুহূর্ত গুরুত্বপূর্ণ",
    sectionMain: "প্রধান",
    sectionEmergency: "জরুরি",
    logout: "লগআউট",
    collapse: "সংকুচিত করুন",
    expandSidebar: "সাইডবার প্রসারিত করুন",
    roleLabels: {
      patient: "রোগী",
      driver: "অ্যাম্বুলেন্স চালক",
      hospitalStaff: "হাসপাতাল কর্মী",
      admin: "প্রশাসক",
    },
  },

  topbar: {
    search: "অনুসন্ধান...",
    searchShortcut: "⌘K",
    switchToLight: "লাইট মোডে পরিবর্তন করুন",
    switchToDark: "ডার্ক মোডে পরিবর্তন করুন",
    notifications: "বিজ্ঞপ্তি",
    userMenu: "ব্যবহারকারী মেনু",
    profile: "প্রোফাইল",
    settings: "সেটিংস",
    logout: "লগআউট",
  },

  common: {
    loading: "লোড হচ্ছে...",
    error: "কিছু একটা ভুল হয়েছে",
    success: "সফল",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    submit: "জমা দিন",
    close: "বন্ধ করুন",
    confirm: "নিশ্চিত করুন",
    delete: "মুছুন",
    edit: "সম্পাদনা",
    add: "যোগ করুন",
    search: "অনুসন্ধান",
    filter: "ফিল্টার",
    noData: "কোনো ডেটা উপলব্ধ নেই",
    viewAll: "সব দেখুন",
    learnMore: "আরও জানুন",
    back: "পিছনে",
    next: "পরবর্তী",
    previous: "আগের",
    optional: "ঐচ্ছিক",
    required: "প্রয়োজনীয়",
  },
};

// ============================================================
// HINDI (हिन्दी)
// ============================================================
const hi: Translations = {
  meta: {
    langName: "Hindi",
    langNameNative: "हिन्दी",
    dir: "ltr",
  },

  nav: {
    home: "होम",
    features: "विशेषताएं",
    howItWorks: "कैसे काम करता है",
    about: "हमारे बारे में",
    contact: "संपर्क",
    login: "लॉगिन",
    getStarted: "शुरू करें",
    language: "भाषा",
  },

  hero: {
    badge: "आपातकालीन सेवा · नए रूप में",
    headline1: "हर",
    headline2: "पल",
    headline3: "मायने रखता है।",
    description:
      "एक टैप। GPS सटीकता। स्मार्ट अस्पताल मिलान। रियल-टाइम एम्बुलेंस ट्रैकिंग।",
    descriptionHighlight: "आपकी जेब में जीवन रक्षक तकनीक।",
    ctaPrimary: "मुफ़्त आपातकालीन कार्ड पाएं",
    ctaSecondary: "डेमो देखें",
    trustHipaa: "HIPAA अनुपालित",
    trustActive: "२४/७ सक्रिय",
    trustRealtime: "रियल-टाइम",
    scrollLabel: "स्क्रॉल करें",
    phoneLabel: "LifeLink",
    phoneHold: "आपातकाल के लिए २ सेकंड दबाएं",
    phoneGpsStatus: "GPS सक्रिय · १०८ तैयार",
    phoneProfileLabel: "आपकी आपातकालीन प्रोफ़ाइल",
    statLivesSaved: "जीवन बचाए",
    statHospitals: "अस्पताल",
    statResponse: "औसत प्रतिक्रिया",
    statUptime: "अपटाइम",
    ticker: [
      "🚑 47 सेकेंड में एम्बुलेंस रवाना — मुंबई",
      "✅ एम्स इमरजेंसी में मरीज भर्ती — दिल्ली",
      "🏥 4 बेड खाली कराए गए — बेंगलुरु",
      "⚡ 3.8 मिनट औसत रिस्पॉन्स टाइम",
      "🚑 एम्बुलेंस रास्ते में है — चेन्नई",
      "✅ आपातकालीन स्थिति हल हुई — पुणे",
      "❤️ इस वर्ष 50,000+ जीवन बचाए गए",
      "🛡️ HIPAA प्रमाणित और एनक्रिप्टेड",
    ],
  },

  features: {
    badge: "आपातकाल के लिए बनाया गया",
    heading: "वह सब जो आपको चाहिए",
    headingGradient: "जब हर पल कीमती हो।",
    subheading:
      "छह सटीक-इंजीनियर विशेषताएं जो SOS टैप से लेकर अस्पताल प्रवेश तक हर पल का संचालन करती हैं।",
    learnMore: "और जानें",
    items: {
      sos: {
        title: "तत्काल SOS",
        description:
          "एक-टैप आपातकालीन अलर्ट २ सेकंड से कम में आपका GPS बचावकर्ताओं और संपर्कों के साथ साझा करता है।",
      },
      hospital: {
        title: "स्मार्ट अस्पताल मिलान",
        description:
          "AI विशेषता, रियल-टाइम उपलब्धता और ट्रैफ़िक के आधार पर निकटतम अस्पताल खोजता है।",
      },
      tracking: {
        title: "लाइव ट्रैकिंग",
        description:
          "लाइव मैप पर रियल-टाइम एम्बुलेंस की स्थिति — जानें कब मदद आएगी।",
      },
      qrCard: {
        title: "मेडिकल QR कार्ड",
        description:
          "रक्त प्रकार, एलर्जी, दवाइयां — एक QR स्कैन में आपकी पूरी प्रोफ़ाइल।",
      },
      aiTriage: {
        title: "AI ट्राइएज",
        description:
          "तत्काल गंभीरता मूल्यांकन आपकी आपात स्थिति को सही संसाधनों तक स्वचालित रूप से भेजता है।",
      },
      familyAlerts: {
        title: "पारिवारिक अलर्ट",
        description:
          "प्रियजनों को लाइव अपडेट मिलते हैं: स्थान, अस्पताल ETA, और स्टेटस — सब स्वचालित।",
      },
    },
  },

  howItWorks: {
    badge: "कैसे काम करता है",
    heading: "SOS से",
    headingGradient: "मिनटों में उपचार",
    subheading:
      "छह आसान चरण जो आपको जीवन रक्षक देखभाल से जोड़ते हैं जब हर पल कीमती हो।",
    steps: {
      step1: {
        title: "SOS दबाएं",
        description:
          "तत्काल आपातकालीन अलर्ट ट्रिगर करने के लिए SOS बटन टैप करें।",
      },
      step2: {
        title: "GPS कैप्चर",
        description:
          "आपका सटीक स्थान कैप्चर कर बचावकर्ताओं के साथ साझा किया जाता है।",
      },
      step3: {
        title: "एम्बुलेंस नियुक्त",
        description: "निकटतम उपलब्ध एम्बुलेंस आपके पास भेजी जाती है।",
      },
      step4: {
        title: "लाइव ट्रैकिंग",
        description: "ETA अपडेट के साथ रियल-टाइम में एम्बुलेंस ट्रैक करें।",
      },
      step5: {
        title: "अस्पताल तैयार",
        description:
          "अस्पताल आपके मेडिकल डेटा के साथ आपके आगमन की तैयारी करता है।",
      },
      step6: {
        title: "आगमन पर QR स्कैन",
        description:
          "आपका QR कार्ड आपकी पूरी मेडिकल प्रोफ़ाइल तक तत्काल पहुंच देता है।",
      },
    },
  },

  stats: {
    badge: "लाइव नेटवर्क",
    heading: "आंकड़े जो",
    headingGradient: "जीवन बचाते हैं।",
    subheading:
      "२०० से अधिक शहरों में हमारे आपातकालीन प्रतिक्रिया नेटवर्क से रियल-टाइम मेट्रिक्स।",
    activeEmergencies: "आज की सक्रिय आपात स्थितियां",
    hospitalsOnline: "अस्पताल ऑनलाइन",
    avgResponse: "औसत प्रतिक्रिया समय",
    satisfaction: "मरीज़ संतुष्टि",
  },

  testimonials: {
    badge: "प्रशंसापत्र",
    heading: "असली कहानियां,",
    headingGradient: "असली जीवन बचाए",
    subheading:
      "उन लोगों की बात सुनें जिनका जीवन LifeLink की आपातकालीन प्रतिक्रिया प्रणाली ने बदल दिया।",
    items: {
      priya: {
        role: "मधुमेह रोगी, मुंबई",
        text: "अकेले यात्रा के दौरान मुझे गंभीर हाइपोग्लाइसेमिक दौरा पड़ा। LifeLink ने मेरी मेडिकल प्रोफ़ाइल से स्थिति पहचानी और निकटतम अस्पताल को सतर्क किया। एम्बुलेंस ३ मिनट से कम में आ गई। इस ऐप ने सचमुच मेरी जान बचाई।",
      },
      rajesh: {
        role: "हृदय रोगी, दिल्ली",
        text: "सुबह की सैर के दौरान सीने में दर्द होने पर SOS दबाया। कुछ ही सेकंड में मेरी पत्नी को अलर्ट मिला और एम्बुलेंस भेजी गई। मेरे पहुंचने से पहले ही अस्पताल के पास मेरी ECG हिस्ट्री तैयार थी। अविश्वसनीय तकनीक।",
      },
      ananya: {
        role: "दो बच्चों की मां, बैंगलोर",
        text: "पार्क में मेरे बेटे को एलर्जिक रिएक्शन हुआ। QR कार्ड ने पैरामेडिक्स को तुरंत उसकी मूंगफली एलर्जी और दवाई के बारे में बताया। उन्होंने तुरंत इलाज किया। एक माता-पिता के रूप में यह मुझे बहुत मानसिक शांति देता है।",
      },
    },
  },

  liveFeed: {
    badge: "लाइव नेटवर्क गतिविधि",
    heading: "हमारा नेटवर्क",
    headingGradient: "कभी नहीं सोता।",
    description: "200+ शहरों में, लाइफलिंक 24/7 हजारों आपातकालीन प्रतिक्रियाओं का समन्वय करता है — औसतन 4 मिनट से कम समय में मरीजों को सही इलाज से जोड़ता है।",
    statActive: "अभी सक्रिय",
    statAmbulances: "ऑनलाइन एम्बुलेंस",
    statHospitals: "जुड़े अस्पताल",
    feedHeader: "लाइव इमरजेंसी फीड",
    liveBadge: "लाइव",
    feedFooter: "पूरे भारत की लाइव घटनाएं दिखाई जा रही हैं · रियल-टाइम में अपडेटेड",
  },

  videoShowcase: {
    badge: "कार्रवाई में देखें",
    heading: "देखें कि हम कैसे",
    headingGradient: "जीवन बचा रहे हैं",
    subheading: "असली कहानियां। असली तकनीक। पहले टैप से लेकर अस्पताल में भर्ती होने तक लाइफलिंक कैसे काम करता है, देखें।",
    v1Title: "आपातकालीन प्रतिक्रिया कैसे काम करती है",
    v1Desc: "देखें कि मेडिकल इमरजेंसी के दौरान लाइफलिंक कैसे मरीजों को एम्बुलेंस और अस्पतालों से रियल-टाइम में जोड़ता है।",
    v1Tag: "कैसे काम करता है",
    v2Title: "एम्बुलेंस डिस्पैच तकनीक",
    v2Desc: "एआई-संचालित डिस्पैच सिस्टम देखें जो सेकंडों में निकटतम एम्बुलेंस आवंटित करता है।",
    v2Tag: "तकनीक",
    v3Title: "मरीज की सुरक्षा और गोपनीयता",
    v3Desc: "आपका मेडिकल डेटा एनक्रिप्टेड रहता है और केवल अधिकृत स्वास्थ्य सेवा प्रदाताओं के साथ साझा किया जाता है।",
    v3Tag: "सुरक्षा",
  },

  demoModal: {
    modalTitle: "लाइफलिंक इंटरएक्टिव डेमो",
    modalDesc: "अनुभव करें कि कैसे लाइफलिंक आपातकालीन चिकित्सा प्रतिक्रिया के हर चरण का संचालन करता है",
    pause: "डेमो रोकें",
    playDemo: "डेमो चलाएं",
    prev: "पिछला",
    next: "अगला चरण",
    done: "डेमो बंद करें",
  },

  cta: {
    badge: "अपना कार्ड पाएं",
    heading: "आपका मेडिकल आपातकालीन कार्ड,",
    headingGradient: "हमेशा तैयार",
    description:
      "२ मिनट से कम में अपना मुफ़्त डिजिटल मेडिकल ID कार्ड बनाएं। यह आपके रक्त प्रकार, एलर्जी, दवाइयां और आपातकालीन संपर्क संग्रहीत करता है — QR कोड द्वारा तत्काल पहुंच योग्य।",
    ctaPrimary: "मुफ़्त साइन अप करें",
    ctaNote: "क्रेडिट कार्ड की आवश्यकता नहीं",
    features: [
      "तत्काल QR कोड जनरेशन",
      "ऑफ़लाइन एक्सेस हमेशा काम करती है",
      "परिवार के साथ शेयर करने योग्य",
      "HIPAA अनुपालित और एन्क्रिप्टेड",
    ],
    cardTitle: "मेडिकल ID",
    cardSubtitle: "LifeLink",
    scanLabel: "पूरी प्रोफ़ाइल के लिए स्कैन करें",
    scanSub: "आपातकालीन संपर्क और मेडिकल इतिहास",
    emergencyContactLabel: "आपातकालीन संपर्क",
    bloodLabel: "रक्त",
    allergiesLabel: "एलर्जी",
    medicationsLabel: "दवाइयां",
  },

  footer: {
    tagline:
      "हर पल मायने रखता है। LifeLink मरीज़ों को अस्पतालों और एम्बुलेंस से रियल-टाइम में जोड़ता है, AI द्वारा संचालित और आपातकाल के लिए बनाया गया।",
    hotline: "आपातकालीन हेल्पलाइन: १०८ — २४/७ उपलब्ध",
    copyright: "LifeLink Technologies Inc. सर्वाधिकार सुरक्षित।",
    columns: {
      product: {
        title: "उत्पाद",
        links: [
          "विशेषताएं",
          "मूल्य निर्धारण",
          "एकीकरण",
          "मोबाइल ऐप",
          "API डॉक्स",
        ],
      },
      company: {
        title: "कंपनी",
        links: ["हमारे बारे में", "करियर", "ब्लॉग", "प्रेस", "साझेदार"],
      },
      support: {
        title: "सहायता",
        links: [
          "सहायता केंद्र",
          "संपर्क करें",
          "सिस्टम स्टेटस",
          "समुदाय",
          "प्रशिक्षण",
        ],
      },
      legal: {
        title: "कानूनी",
        links: ["गोपनीयता नीति", "सेवा शर्तें", "अनुपालन", "कुकी नीति", "GDPR"],
      },
    },
    bottomLinks: { privacy: "गोपनीयता", terms: "शर्तें", cookies: "कुकीज़" },
  },

  login: {
    backToHome: "होम पर वापस",
    heading: "साइन इन",
    subheading: "अपना अकाउंट एक्सेस करने के लिए जानकारी दर्ज करें",
    orEmail: "या ईमेल से जारी रखें",
    emailLabel: "ईमेल",
    emailPlaceholder: "you@example.com",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    forgotPassword: "पासवर्ड भूल गए?",
    rememberMe: "३० दिनों के लिए याद रखें",
    signIn: "साइन इन",
    signingIn: "साइन इन हो रहा है...",
    demoAccess: "त्वरित डेमो एक्सेस",
    demoPasswordNote: "पासवर्ड पहले से भरा है:",
    noAccount: "अकाउंट नहीं है?",
    signUp: "साइन अप",
    hipaaCompliant: "HIPAA अनुपालित",
    encrypted: "२५६-बिट एन्क्रिप्टेड",
    resetPasswordTitle: "पासवर्ड रीसेट",
    resetPasswordDesc:
      "अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट लिंक भेजेंगे।",
    resetEmailLabel: "ईमेल पता",
    cancel: "रद्द करें",
    sendResetLink: "रीसेट लिंक भेजें",
    errorInvalidCredentials: "ईमेल या पासवर्ड गलत है",
    errorEmail: "अपना ईमेल पता दर्ज करें",
    errorPassword: "अपना पासवर्ड दर्ज करें",
    tagline: "हर पल मायने रखता है",
    taglineSub: "स्मार्ट आपातकालीन चिकित्सा प्रतिक्रिया प्रणाली",
    statLivesSaved: "जीवन बचाए",
    statHospitalsOnline: "अस्पताल ऑनलाइन",
    statAmbulancesActive: "एम्बुलेंस सक्रिय",
    statAvgResponse: "औसत प्रतिक्रिया (मिनट)",
    testimonialQuote:
      '"LifeLink ने मेरे पिताजी की जान बचाई। एम्बुलेंस ४ मिनट से कम में आ गई।"',
    testimonialAuthor: "— प्रिया एम., सत्यापित मरीज़",
    googleBtn: "Google",
    appleBtn: "Apple",
  },

  signup: {
    backToHome: "होम पर वापस",
    heading: "LifeLink से जुड़ें",
    subheading:
      "अपनी ज़रूरतों के अनुसार व्यक्तिगत अनुभव शुरू करने के लिए अपनी भूमिका चुनें।",
    alreadyHaveAccount: "पहले से अकाउंट है?",
    signIn: "साइन इन",
    chooseRole: "अपनी भूमिका चुनें",
    next: "जारी रखें",
    back: "वापस",
    submit: "अकाउंट बनाएं",
    submitting: "अकाउंट बन रहा है...",
    successTitle: "अकाउंट बन गया!",
    errorFix: "जारी रखने से पहले त्रुटियां ठीक करें",
    errorNetwork: "नेटवर्क त्रुटि। अपना कनेक्शन जांचें।",
    errorSignup: "साइन अप विफल। फिर से प्रयास करें।",
    roles: {
      patient: {
        label: "मरीज़",
        description:
          "आपातकालीन सेवाएं एक्सेस करें, एम्बुलेंस ट्रैक करें, स्वास्थ्य प्रोफ़ाइल प्रबंधित करें",
        features: [
          "SOS आपातकालीन बटन",
          "रियल-टाइम एम्बुलेंस ट्रैकिंग",
          "मेडिकल रिकॉर्ड",
          "AI स्वास्थ्य सहायक",
        ],
      },
      driver: {
        label: "एम्बुलेंस चालक",
        description:
          "आपातकालीन असाइनमेंट प्रबंधित करें, अपनी गाड़ी ट्रैक करें, उपलब्धता अपडेट करें",
        features: [
          "आपातकालीन असाइनमेंट",
          "लाइव नेविगेशन",
          "कमाई डैशबोर्ड",
          "वाहन प्रबंधन",
        ],
      },
      hospitalStaff: {
        label: "अस्पताल कर्मचारी",
        description:
          "आपातकालीन कतार, मरीज़ प्रवेश और अस्पताल संसाधन प्रबंधित करें",
        features: [
          "आपातकालीन कतार",
          "मरीज़ प्रवेश",
          "बेड प्रबंधन",
          "संसाधन ट्रैकिंग",
        ],
      },
      admin: {
        label: "प्रशासक",
        description: "LifeLink प्रबंधन कंसोल और सिस्टम निगरानी तक पूर्ण पहुंच",
        features: [
          "सिस्टम प्रबंधन",
          "उपयोगकर्ता प्रशासन",
          "विश्लेषण और रिपोर्ट",
          "पूर्ण कंसोल एक्सेस",
        ],
      },
    },
    steps: {
      account: "अकाउंट",
      accountDesc: "अपना व्यक्तिगत अकाउंट क्रेडेंशियल बनाएं",
      medicalProfile: "मेडिकल प्रोफ़ाइल",
      medicalProfileDesc: "अपनी बुनियादी मेडिकल जानकारी जोड़ें",
      medicalHistory: "मेडिकल इतिहास",
      medicalHistoryDesc: "एलर्जी, दवाइयां और स्थितियों की सूची",
      emergencyContact: "आपातकालीन संपर्क",
      emergencyContactDesc: "आपात स्थिति में हम किससे संपर्क करें?",
      driverDetails: "चालक विवरण",
      driverDetailsDesc: "लाइसेंस, अनुभव और वाहन जानकारी",
      hospitalRole: "अस्पताल और भूमिका",
      hospitalRoleDesc: "अपना अस्पताल और विभाग चुनें",
      verification: "सत्यापन",
      verificationDesc: "अपना एडमिन आमंत्रण कोड दर्ज करें",
      confirm: "पुष्टि करें",
      confirmDesc: "अपनी प्रोफ़ाइल समीक्षा करें और सबमिट करें",
    },
    fields: {
      fullName: "पूरा नाम",
      fullNamePlaceholder: "राहुल शर्मा",
      email: "ईमेल पता",
      emailPlaceholder: "you@example.com",
      phone: "फ़ोन नंबर",
      phonePlaceholder: "+91-9876543210",
      password: "पासवर्ड",
      passwordPlaceholder: "न्यूनतम ८ अक्षर",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      confirmPasswordPlaceholder: "पासवर्ड दोबारा दर्ज करें",
      passwordStrengthWeak: "कमज़ोर",
      passwordStrengthFair: "ठीक",
      passwordStrengthGood: "अच्छा",
      passwordStrengthStrong: "मजबूत",
      bloodGroup: "रक्त समूह",
      selectBloodGroup: "रक्त समूह चुनें",
      dateOfBirth: "जन्म तिथि",
      gender: "लिंग",
      selectGender: "लिंग चुनें",
      genderMale: "पुरुष",
      genderFemale: "महिला",
      genderNonBinary: "नॉन-बाइनरी",
      genderPreferNot: "बताना नहीं चाहते",
      address: "घर का पता",
      addressOptional: "(वैकल्पिक)",
      addressPlaceholder: "अपना घर का पता दर्ज करें",
      allergies: "एलर्जी",
      allergiesPlaceholder: "जैसे: पेनिसिलिन, मूंगफली, लेटेक्स",
      medications: "वर्तमान दवाइयां",
      medicationsPlaceholder: "जैसे: मेटफॉर्मिन ५०० मि.ग्रा., एस्पिरिन",
      chronicConditions: "दीर्घकालिक बीमारियां",
      chronicConditionsPlaceholder: "जैसे: मधुमेह, उच्च रक्तचाप",
      tagInputHint: "प्रत्येक आइटम जोड़ने के लिए Enter या कॉमा दबाएं",
      emergencyName: "संपर्क का नाम",
      emergencyNamePlaceholder: "सीता शर्मा",
      emergencyRelationship: "संबंध",
      selectRelationship: "संबंध चुनें",
      emergencyPhone: "संपर्क का फ़ोन",
      emergencyPhonePlaceholder: "+91-9876543210",
      licenseNumber: "लाइसेंस नंबर",
      licenseNumberPlaceholder: "DL-0420110012345",
      experience: "अनुभव के वर्ष",
      experiencePlaceholder: "जैसे: ५",
      vehicleNumber: "वाहन नंबर",
      vehicleNumberPlaceholder: "DL-01-EM-0012",
      selectHospital: "अपना अस्पताल चुनें",
      department: "विभाग",
      departmentPlaceholder: "जैसे: आपातकाल, ICU",
      employeeId: "कर्मचारी ID",
      employeeIdPlaceholder: "EMP-12345",
      adminCode: "एडमिन आमंत्रण कोड",
      adminCodePlaceholder: "आमंत्रण कोड दर्ज करें",
    },
    validation: {
      nameRequired: "पूरा नाम आवश्यक है",
      nameMinLength: "नाम कम से कम २ अक्षरों का होना चाहिए",
      emailRequired: "ईमेल आवश्यक है",
      emailInvalid: "कृपया एक मान्य ईमेल दर्ज करें",
      phoneRequired: "फ़ोन नंबर आवश्यक है",
      phoneInvalid: "कृपया एक मान्य फ़ोन नंबर दर्ज करें",
      passwordRequired: "पासवर्ड आवश्यक है",
      passwordMinLength: "पासवर्ड कम से कम ८ अक्षरों का होना चाहिए",
      confirmPasswordRequired: "कृपया अपना पासवर्ड पुष्टि करें",
      passwordMismatch: "पासवर्ड मेल नहीं खाते",
      bloodGroupRequired: "अपना रक्त समूह चुनें",
      dobRequired: "अपनी जन्म तिथि दर्ज करें",
      genderRequired: "अपना लिंग चुनें",
      licenseRequired: "लाइसेंस नंबर आवश्यक है",
      experienceRequired: "अनुभव के वर्ष आवश्यक हैं",
      vehicleRequired: "वाहन नंबर आवश्यक है",
      hospitalRequired: "कृपया अपना अस्पताल चुनें",
      departmentRequired: "विभाग आवश्यक है",
      adminCodeRequired: "एडमिन आमंत्रण कोड आवश्यक है",
    },
    medicalHistoryNote:
      "इससे आपातकालीन बचावकर्ताओं को बेहतर देखभाल प्रदान करने में मदद मिलती है। सभी क्षेत्र वैकल्पिक हैं — जितना चाहें उतना जोड़ें।",
    emergencyContactNote:
      "वैकल्पिक लेकिन अत्यधिक अनुशंसित। आपातकाल में जब आप संवाद नहीं कर सकते तो हम इस व्यक्ति को सूचित करेंगे।",
    relationships: [
      "पति/पत्नी",
      "माता-पिता",
      "भाई-बहन",
      "बच्चा",
      "मित्र",
      "अन्य",
    ],
  },

  sidebar: {
    tagline: "हर पल मायने रखता है",
    sectionMain: "मुख्य",
    sectionEmergency: "आपातकाल",
    logout: "लॉगआउट",
    collapse: "संकुचित करें",
    expandSidebar: "साइडबार विस्तृत करें",
    roleLabels: {
      patient: "मरीज़",
      driver: "एम्बुलेंस चालक",
      hospitalStaff: "अस्पताल कर्मचारी",
      admin: "प्रशासक",
    },
  },

  topbar: {
    search: "खोजें...",
    searchShortcut: "⌘K",
    switchToLight: "लाइट मोड में बदलें",
    switchToDark: "डार्क मोड में बदलें",
    notifications: "सूचनाएं",
    userMenu: "उपयोगकर्ता मेनू",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
  },

  common: {
    loading: "लोड हो रहा है...",
    error: "कुछ गलत हुआ",
    success: "सफल",
    cancel: "रद्द करें",
    save: "सहेजें",
    submit: "सबमिट करें",
    close: "बंद करें",
    confirm: "पुष्टि करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    search: "खोजें",
    filter: "फ़िल्टर",
    noData: "कोई डेटा उपलब्ध नहीं",
    viewAll: "सब देखें",
    learnMore: "और जानें",
    back: "वापस",
    next: "आगे",
    previous: "पिछला",
    optional: "वैकल्पिक",
    required: "आवश्यक",
  },
};

// ============================================================
// Registry + helpers
// ============================================================

export const TRANSLATIONS: Record<Language, Translations> = { en, bn, hi };

export const LANGUAGES: {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
];

export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_STORAGE_KEY = "lifelink-language";
