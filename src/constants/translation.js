import { useActionState } from "react";

export const translations = {
  en: {
    // Language selection
    en: "English",
    fr: "Français",
    
    // Common UI elements
    login: "Login",
    logout: "Logout",
    register: "Register",
    welcome: "Welcome",
    learnMore: "Learn More",
    save: "Save",
    generate: "Generate",
    loading: "Loading...",
    success: "Success!",
    error: "Error",
    requiredField: "This field is required",
    acceptTerms: "I agree to the Terms of Service and Privacy Policy",
    alreadyHaveAccount: "Already have an account?",
    changeLanguage: "Change language",
    
    // Application specific
    appName: "Cocoa Cameroon",
    platformDescription: "Trusted platform for buying and selling cocoa beans and related products. Choose an action below to get started.",
    
    // Map component
    plotsTitle: "Plots",
    searchPlaceholder: "Search by {mode}",
    searchOptions: {
      producerCode: "Producer Code",
      village: "Village",
      region: "Region"
    },
    searchButton: "Search",
    resetFilters: "Reset Filters",
    showFilters: "Show Filters",
    hideFilters: "Hide Filters",
    filterPlaceholder: "Filter by {field}",
    noResults: "No features match your criteria.",
    loadError: "Failed to load GeoJSON data",
    legendTitle: "Legend",
    legendItems: {
      filter: "Filtered results",
      default: "Default"
    },
    downloadPDF: "Download PDF",
    summaryTitle: "Summary",
    showLegend: "Show Legend",
    
    // Home component
    welcome: {
      title: "Welcome",
      subtitle: "Cocoa Trace",
      description: "Trusted platform for buying and selling cocoa beans and related products. Choose an action below to get started."
    },
    actions: {
      learnMore: "Learn More",
      purchase: {
        title: "Make a Purchase",
        description: "If you are a cooperative or exporter, buy directly from producers.",
        alt: "Purchase"
      },
      sale: {
        title: "Make a Sale",
        description: "Producers can list their products and connect with buyers here.",
        alt: "Sale"
      },
      map: {
        title: "View Plots",
        description: "Access detailed maps of your cocoa parcels and their locations.",
        alt: "Map"
      },
      stats: {
        title: "Statistics Module",
        description: "View your sales and purchases summaries and detailed statistics.",
        alt: "Statistics"
      }
    },
    qrCode: {
      title: "Producer QR Code Generator",
      placeholder: "Enter code...",
      generate: "Generate",
      saveButton: "Save QR",
      filename: "producer-qrcode"
    },
    
    // Navigation
    navigation: {
      home: "Home",
      about: "About",
      contact: "Contact",
      dashboard: "Dashboard"
    },
    
    // Forms
    registerTitle: "Create an Account",
    registrationSuccessful: "Registration successful!",
    formLabels: {
      username: "Username",
      code: "Code",
      email: "Email",
      phone: "Phone Number",
      password: "Password"
    },
    passwordRequirements: "Password must be 8-15 characters, start with a letter, and use only letters, digits or underscores.",
    registerButton: "Sign Up",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    
    // Field labels
    fieldLabels: {
      id: "Parcel Code",
      producerCode: "Producer Code",
      name: "First Name",
      surname: "Last Name",
      sex: "Sex",
      ageplantat: "Age of Plantation",
      plantnumbe: "Number of Trees",
      output: "Productivity",
      fertilizer: "Fertilizer Used",
      nberfertil: "Number of Fertilizations",
      insecticid: "Insecticide Used",
      nberinsect: "Number of Insecticide Treatments",
      problems: "Problems Encountered",
      tel: "Phone",
      region: "Region",
      departemen: "Department",
      village: "Village",
      residence: "Residence",
      lieudit: "Edit Location",
      education: "Education Level",
      matrimonia: "Marital Status",
      Statut: "Status",
      Operateur: "Operator",
      subdivisio: "Subdivision",
      landstatus: "Land Status",
      cooperativ: "Cooperative",
      x: "Longitude",
      y: "Latitude"
    },
    
    // UI Options
    tileOptions: {
      OSM: "OpenStreetMap",
      "Black & White": "Black & White",
      Satellite: "Satellite"
    },
    themeOptions: {
      Light: "Light",
      Dark: "Dark",
      Forest: "Forest"
    },
    
    // Errors
    errors: {
      logoutFailed: "Logout failed"
    },

    // Administration
    addplot: "Add Plot",
    searchByName: "Search By Name",
    name: "Name",
    addCooperative: "Add Cooperative",
    edit: "Edit",
    users: "Users",
    plots: "Plots",
    cooperatives: "Cooperatives",
    exporters: "Exporters",
    addUser: "Add User",
    userM: "User Management Dashboard",
    searchUserMode: "Search by code / phone / email / name",
    search: "Search",
    phone: "Phone",
    username: "Username",
    email: "Email",
    code: "Code",
    delete: "Delete",

    // Admin Sale / Purchase
    admin: {
      sale: {
        title: "Sales",
        add: "Add Sale",
        edit: "Edit Sale",
        quantity: "Quantity (kg)",
        price: "Price (FCFA/kg)",
        date: "Date of Sale",
        code: "Producer Code",
        cooperative: "Cooperative",
        buyer: "Buyer",
        submit: "Submit Sale",
        confirmDelete: "Are you sure you want to delete this sale?",
        deleteSuccess: "Sale deleted successfully",
        editSuccess: "Sale updated successfully",
        addSuccess: "Sale created successfully",
      },
      purchase: {
        title: "Purchases",
        add: "Add Purchase",
        edit: "Edit Purchase",
        quantity: "Quantity (kg)",
        price: "Price (FCFA/kg)",
        date: "Date of Purchase",
        exporter: "Exporter",
        seller: "Seller (Cooperative)",
        submit: "Submit Purchase",
        confirmDelete: "Are you sure you want to delete this purchase?",
        deleteSuccess: "Purchase deleted successfully",
        editSuccess: "Purchase updated successfully",
        addSuccess: "Purchase created successfully",
      },
      table: {
        action: "Action",
        edit: "Edit",
        delete: "Delete",
        view: "View",
        total: "Total",
        noData: "No data available",
      }
    },
  },
  fr: {
    // Language selection
    en: "English",
    fr: "Français",
    
    // Common UI elements
    login: "Connexion",
    logout: "Déconnexion",
    register: "S'inscrire",
    welcome: "Bienvenue",
    learnMore: "En savoir plus",
    save: "Enregistrer",
    generate: "Générer",
    loading: "Chargement...",
    success: "Succès!",
    error: "Erreur",
    requiredField: "Ce champ est obligatoire",
    acceptTerms: "J'accepte les Conditions d'Utilisation et la Politique de Confidentialité",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    changeLanguage: "Changer de langue",
    
    // Application specific
    appName: "Cacao Cameroun",
    platformDescription: "Plateforme fiable pour l'achat et la vente de fèves de cacao et produits dérivés. Choisissez une action ci-dessous pour commencer.",
    
    // Map component
    plotsTitle: "Parcelles",
    searchPlaceholder: "Rechercher par {mode}",
    searchOptions: {
      producerCode: "Code Producteur",
      village: "Village",
      region: "Région"
    },
    searchButton: "Rechercher",
    resetFilters: "Réinitialiser les Filtres",
    showFilters: "Afficher les Filtres",
    hideFilters: "Masquer les Filtres",
    filterPlaceholder: "Filtrer par {field}",
    noResults: "Aucun résultat ne correspond à vos critères.",
    loadError: "Échec du chargement des données GeoJSON",
    legendTitle: "Légende",
    legendItems: {
      filter: "Résultats filtrés",
      default: "Par défaut"
    },
    downloadPDF: "Télécharger PDF",
    summaryTitle: "Résumé",
    showLegend: "Afficher la Légende",
    
    // Home component
    welcome: {
      title: "Bienvenue",
      subtitle: "Traçabilité Cacao",
      description: "Plateforme fiable pour l'achat et la vente de fèves de cacao et produits dérivés. Choisissez une action ci-dessous pour commencer."
    },
    actions: {
      learnMore: "En savoir plus",
      purchase: {
        title: "Faire un Achat",
        description: "Si vous êtes une coopérative ou exportateur, achetez directement auprès des producteurs.",
        alt: "Achat"
      },
      sale: {
        title: "Faire une Vente",
        description: "Les producteurs peuvent lister leurs produits et se connecter avec des acheteurs ici.",
        alt: "Vente"
      },
      map: {
        title: "Voir les Parcelles",
        description: "Accédez aux cartes détaillées de vos parcelles de cacao et leurs localisations.",
        alt: "Carte"
      },
      stats: {
        title: "Module Statistiques",
        description: "Consultez vos résumés de ventes et achats ainsi que des statistiques détaillées.",
        alt: "Statistiques"
      }
    },
    qrCode: {
      title: "Générateur de QR Code Producteur",
      placeholder: "Entrez le code...",
      generate: "Générer",
      saveButton: "Enregistrer QR",
      filename: "qrcode-producteur"
    },
    
    // Navigation
    navigation: {
      home: "Accueil",
      about: "À propos",
      contact: "Contact",
      dashboard: "Tableau de bord"
    },
    
    // Forms
    registerTitle: "Créer un Compte",
    registrationSuccessful: "Inscription réussie!",
    formLabels: {
      username: "Nom d'utilisateur",
      code: "Code",
      email: "Email",
      phone: "Numéro de téléphone",
      password: "Mot de passe"
    },
    passwordRequirements: "Le mot de passe doit contenir 8-15 caractères, commencer par une lettre, et n'utiliser que des lettres, chiffres ou underscores.",
    registerButton: "S'inscrire",
    termsOfService: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialité",
    
    // Field labels
    fieldLabels: {
      id: "Code Parcelle",
      producerCode: "Code Producteur",
      name: "Prénom",
      surname: "Nom",
      sex: "Sexe",
      ageplantat: "Âge de la Plantation",
      plantnumbe: "Nombre d'Arbres",
      output: "Productivité",
      fertilizer: "Engrais Utilisé",
      nberfertil: "Nombre de Fertilisations",
      insecticid: "Insecticide Utilisé",
      nberinsect: "Nombre de Traitements Insecticides",
      problems: "Problèmes Rencontrés",
      tel: "Téléphone",
      region: "Région",
      departemen: "Département",
      village: "Village",
      residence: "Résidence",
      lieudit: "Lieu-dit",
      education: "Niveau d'Éducation",
      matrimonia: "Statut Matrimonial",
      Statut: "Statut",
      Operateur: "Opérateur",
      subdivisio: "Subdivision",
      landstatus: "Statut Foncier",
      cooperativ: "Coopérative",
      x: "Longitude",
      y: "Latitude"
    },
    
    // UI Options
    tileOptions: {
      OSM: "OpenStreetMap",
      "Black & White": "Noir et Blanc",
      Satellite: "Satellite"
    },
    themeOptions: {
      Light: "Clair",
      Dark: "Sombre",
      Forest: "Forêt"
    },
    
    // Errors
    errors: {
      logoutFailed: "Échec de la déconnexion"
    },

    // Administration
    addplot: "Ajouter une Parcelle",
    searchByName: "Rechercher par Nom",
    name: "Nom",
    addCooperative: "Ajouter une Coopérative",
    edit: "Modifier",
    users: "Utilisateurs",
    plots: "Parcelles",
    cooperatives: "Coopératives",
    exporters: "Exportateurs",
    addUser: "Ajouter un Utilisateur",
    userM: "Tableau de Bord de Gestion des Utilisateurs",
    searchUserMode: "Rechercher par code / téléphone / email / nom",
    search: "Rechercher",
    phone: "Téléphone",
    username: "Nom d'utilisateur",
    email: "Email",
    code: "Code",
    delete: "Supprimer",

    // Admin Sale / Purchase
    admin: {
      sale: {
        title: "Ventes",
        add: "Ajouter une Vente",
        edit: "Modifier la Vente",
        quantity: "Quantité (kg)",
        price: "Prix (FCFA/kg)",
        date: "Date de Vente",
        code: "Code Producteur",
        cooperative: "Coopérative",
        buyer: "Acheteur",
        submit: "Soumettre la Vente",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cette vente ?",
        deleteSuccess: "Vente supprimée avec succès",
        editSuccess: "Vente mise à jour avec succès",
        addSuccess: "Vente créée avec succès",
      },
      purchase: {
        title: "Achats",
        add: "Ajouter un Achat",
        edit: "Modifier l'Achat",
        quantity: "Quantité (kg)",
        price: "Prix (FCFA/kg)",
        date: "Date d'Achat",
        exporter: "Exportateur",
        seller: "Vendeur (Coopérative)",
        submit: "Soumettre l'Achat",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cet achat ?",
        deleteSuccess: "Achat supprimé avec succès",
        editSuccess: "Achat mis à jour avec succès",
        addSuccess: "Achat créé avec succès",
      },
      table: {
        action: "Action",
        edit: "Modifier",
        delete: "Supprimer",
        view: "Voir",
        total: "Total",
        noData: "Aucune donnée disponible",
      }
    },
  }
};

export const t = (lang, key, replacements = {}) => {
  if (!translations[lang]) {
    console.warn(`Language ${lang} not found`);
    return key;
  }

  const keys = key.split('.');
  let result = translations[lang];
  
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) {
      console.warn(`Translation key ${key} not found for language ${lang}`);
      return key;
    }
  }

  if (typeof result === 'object') return result;

  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
  }

  return result;
};