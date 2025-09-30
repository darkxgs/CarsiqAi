// Minimal official specs schema (starting from scratch)
export interface CarSpec {
  capacity: string
  viscosity: string
  oilType: "Full Synthetic" | "Semi Synthetic" | "Conventional" | "High Mileage"
  apiSpec?: string
}

export interface YearCategory {
  [yearRange: string]: CarSpec | { [engineVariant: string]: CarSpec }
}

export interface CarModel {
  [model: string]: YearCategory
}

export interface ManufacturerSpecs {
  [manufacturer: string]: CarModel
}

// Hyundai data (validated and added)
// Middle East/GCC–focused Hyundai dataset (official-manual sourced)
// Fields: capacity (with filter), viscosity, oilType, apiSpec
const hyundai: CarModel = {
 elantra: {
  // CN7 (Current Generation)
  "2021-2025": {
    "2.0L MPI": {
      capacity: "4.3 L",
      viscosity: "5W-20 (0W-20 optional)",
      oilType: "Full Synthetic",
      apiSpec: "API SN or above",
    },
    "1.6L Turbo": {
      capacity: "4.5 L",
      viscosity: "5W-30",
      oilType: "Full Synthetic",
      apiSpec: "API SN Plus / SP",
    },
  },

  // Hybrid Variants
  "2024-2025 Hybrid": {
    "1.6L Hybrid": {
      capacity: "4.2 L",
      viscosity: "0W-20",
      oilType: "Full Synthetic",
      apiSpec: "API SP",
    },
  },

  // Older Generations (manual corroborated)
  "2011-2016": {
    "1.8L / 2.0L": {
      capacity: "4.5 L",
      viscosity: "5W-20",
      oilType: "Full Synthetic",
      apiSpec: "API SN or above",
    },
  },
},



  accent: {
    "2018-2022": {
      "1.6L": {
        capacity: "3.3 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN Plus / SP",
      },
    },
    "2011-2017": {
      "1.6L": {
        capacity: "3.3 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN (or above)",
      },
    },
  },

  i10: {
    "2019-2024": {
      "1.0L": {
        capacity: "3.2 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / SP",
      },
    },
  },

  i20: {
    "2020-2024": {
      "1.2L": {
        capacity: "3.5 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / SP",
      },
      "1.0L Turbo": {
        capacity: "3.6 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN Plus / SP",
      },
    },
  },

  kona: {
    "2018-2021": {
      "2.0L MPI": {
        capacity: "4.0 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API (latest) / ILSAC (latest)",
      },
      "1.6L T-GDI": {
        capacity: "4.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API (latest) / ILSAC (latest) or ACEA A5/B5",
      },
    },
  },

  tucson: {
    // NX4 (current)
    "2022-2025": {
      "2.5L": {
        capacity: "4.8 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SP / ILSAC GF-6",
      },
    },
    // Hybrid (1.6T H/HEV)
    "2022-2025 Hybrid": {
      "1.6L Turbo Hybrid": {
        capacity: "5.7 L", // ~6.0 US qt listed in many manuals; 5.7–6.0 L regionally
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SP",
      },
    },
    // Older gen sample (where official manual covers)
    "2016-2020": {
      "2.0L": {
        capacity: "4.6 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN (or above)",
      },
      "1.6L T-GDI": {
        capacity: "5.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN Plus (or above)",
      },
    },
  },

  sonata: {
    "2020-2024": {
      "2.5L": {
        capacity: "4.8 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SP / ILSAC GF-6",
      },
      "1.6L Turbo": {
        capacity: "5.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP",
      },
    },
    "2020-2024 Hybrid": {
      "2.0L Hybrid": {
        capacity: "4.2 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SP",
      },
    },
    "2011-2019": {
      "2.4L": {
        capacity: "4.9 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN (or above)",
      },
      "2.0L Turbo": {
        capacity: "5.2 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN (or above)",
      },
    },
  },

  santafe: {
    // TM PE + MX5 (includes 2024 redesign guidance)
    "2021-2024": {
      "2.5L": {
        capacity: "5.8 L", // ≈6.1 US qt with filter
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP / ILSAC GF-6",
      },
      "2.5L Turbo": {
        capacity: "5.8 L", // ≈6.1 US qt with filter
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP / ILSAC GF-6",
      },
    },
    "2021-2024 Hybrid/Plug-in": {
      "1.6L Turbo Hybrid": {
        capacity: "4.8 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SP",
      },
    },
    // Older
    "2017-2018": {
      "3.3L V6 (Santa Fe XL)": {
        capacity: "5.7 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SM (or above) / ILSAC GF-4 (or above) / ACEA A5 (or above)",
      },
    },
  },

  palisade: {
    "2020-2025": {
      "3.8L V6": {
        capacity: "6.5 L", // ≈6.9 US qt
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP / ILSAC GF-6",
      },
    },
  },

  staria: {
    "2021-2025": {
      "2.2L Diesel": {
        capacity: "6.3 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API CK-4",
      },
      "3.5L Petrol": {
        capacity: "6.0 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP",
      },
    },
  },

  h1: {
    "2018-2020": {
      "2.5L Diesel": {
        capacity: "7.1 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API CI-4 / CK-4",
      },
    },
  },
};

// Toyota data (added per user request)
const toyota: any = {
  camry: {
    "2021-2024": {
      "2.5L Dynamic Force": {
        capacity: "4.5 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
      "3.5L V6": {
        capacity: "5.7 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
    "2012-2017": {
      "2.5L 2AR-FE": {
        capacity: "4.3 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-5",
      },
      "3.5L 2GR-FE": {
        capacity: "6.1 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-5",
      },
    },
  },

  corolla: {
    "2019-2024": {
      "1.6L": {
        capacity: "4.2 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
      "2.0L Dynamic Force": {
        capacity: "4.5 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
    "2014-2018": {
      "1.8L 2ZR-FE": {
        capacity: "4.4 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-5",
      },
    },
  },

  land_cruiser: {
    "2022-2024": {
      "3.5L Twin Turbo V6": {
        capacity: "6.7 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
      "4.0L V6": {
        capacity: "6.2 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
    "2010-2021": {
      "4.6L V8": {
        capacity: "7.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-5",
      },
      "5.7L V8": {
        capacity: "8.0 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-5",
      },
    },
  },

  hilux: {
    "2016-2024": {
      "2.7L Petrol": {
        capacity: "6.2 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN",
      },
      "2.8L Diesel": {
        capacity: "7.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API CI-4 / SN",
      },
    },
  },

  fortuner: {
    "2016-2024": {
      "2.7L Petrol": {
        capacity: "6.2 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN",
      },
      "2.8L Diesel": {
        capacity: "7.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API CI-4 / SN",
      },
    },
  },

  yaris: {
    "2020-2024": {
      "1.5L": {
        capacity: "3.7 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
    "2014-2019": {
      "1.3L": {
        capacity: "3.2 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-5",
      },
    },
  },

  rav4: {
    "2019-2024": {
      "2.5L Dynamic Force": {
        capacity: "4.8 L",
        viscosity: "0W-16",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
      "Hybrid 2.5L": {
        capacity: "4.5 L",
        viscosity: "0W-16",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
  },

  avalon: {
    "2019-2022": {
      "3.5L V6": {
        capacity: "5.7 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
  },

  highlander: {
    "2020-2024": {
      "3.5L V6": {
        capacity: "5.7 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
      "Hybrid 2.5L": {
        capacity: "4.8 L",
        viscosity: "0W-16",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
  },

  tundra: {
    "2022-2024": {
      "3.5L Twin Turbo V6": {
        capacity: "6.8 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
    "2014-2021": {
      "5.7L V8": {
        capacity: "8.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-5",
      },
    },
  },

  tacoma: {
    "2016-2024": {
      "3.5L V6": {
        capacity: "5.5 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN / ILSAC GF-6",
      },
    },
  },

  bz4x: {
    "2023-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable",
      },
    },
  },
};
 
 // MG data (added per user request)
 const mg: any = {
   zs: {
     "2017-2025": {
       "1.5L": {
         capacity: "4.1 L",
         viscosity: "0W-20",
         oilType: "Full Synthetic",
         apiSpec: "ACEA C5"
       },
       "1.0L Turbo": {
         capacity: "4.0 L",
         viscosity: "0W-20",
         oilType: "Full Synthetic",
         apiSpec: "ACEA C5"
       }
     },
     "2020-2025 EV": {
       EV: {
         capacity: "Not Applicable",
         viscosity: "Not Applicable",
         oilType: "Not Applicable",
         apiSpec: "Not Applicable"
       }
     }
   },
   rx5: {
     "2018-2025": {
       "1.5L Turbo": {
         capacity: "4.0 L",
         viscosity: "0W-20",
         oilType: "Full Synthetic",
         apiSpec: "ACEA C5"
       },
       "2.0L Turbo": {
         capacity: "4.8 L",
         viscosity: "0W-30",
         oilType: "Full Synthetic",
         apiSpec: "ACEA C3"
       }
     }
   },
   hs: {
     "2018-2025": {
       "1.5L Turbo": {
         capacity: "4.0 L",
         viscosity: "0W-20",
         oilType: "Full Synthetic",
         apiSpec: "API SP / ACEA C5"
       },
       "2.0L Turbo": {
         capacity: "4.8 L",
         viscosity: "0W-30",
         oilType: "Full Synthetic",
         apiSpec: "ACEA C3"
       }
     }
   },
   mg5: {
     "2012-2018": {
       "1.5L": {
         capacity: "4.1 L",
         viscosity: "5W-30",
         oilType: "Full Synthetic",
         apiSpec: "API SL"
       }
     },
     "2020-2025": {
       "1.5L (NA)": {
         capacity: "4.1 L",
         viscosity: "5W-30",
         oilType: "Full Synthetic",
         apiSpec: "API SL"
       },
       "1.5L Turbo": {
         capacity: "4.1 L",
         viscosity: "5W-30",
         oilType: "Full Synthetic",
         apiSpec: "API SL"
       }
     }
   },
   mg6: {
     "2010-2016": {
       "1.8L": {
         capacity: "4.3 L",
         viscosity: "5W-30",
         oilType: "Full Synthetic",
         apiSpec: "API SN"
       }
     },
     "2017-2025": {
       "1.5L Turbo": {
         capacity: "4.0 L",
         viscosity: "0W-20",
         oilType: "Full Synthetic",
         apiSpec: "API SP / ACEA C5"
       }
     }
   },
   mg3: {
     "2011-2025": {
       "1.3L": {
         capacity: "3.7 L",
         viscosity: "5W-30",
         oilType: "Full Synthetic",
         apiSpec: "API SL"
       },
       "1.5L": {
         capacity: "4.0 L",
         viscosity: "5W-30",
         oilType: "Full Synthetic",
         apiSpec: "API SL"
       }
     }
   },
   mg7: {
     "2023-2025": {
       "2.0L Turbo": {
         capacity: "4.8 L",
         viscosity: "0W-30",
         oilType: "Full Synthetic",
         apiSpec: "ACEA C3"
       }
     }
   },
   marvel_r: {
     "2021-2025 EV": {
       EV: {
         capacity: "Not Applicable",
         viscosity: "Not Applicable",
         oilType: "Not Applicable",
         apiSpec: "Not Applicable"
       }
     }
   },
   mg4: {
     "2022-2025 EV": {
       EV: {
         capacity: "Not Applicable",
         viscosity: "Not Applicable",
         oilType: "Not Applicable",
         apiSpec: "Not Applicable"
       }
     }
   },
   mg_ehs: {
     "2020-2025 Hybrid": {
       "1.5L Turbo + Electric": {
         capacity: "4.0 L",
         viscosity: "0W-20",
         oilType: "Full Synthetic",
         apiSpec: "API SP / ACEA C5"
       }
     }
   }
 };
 
 // Nissan data (added per user request)
  const nissan: any = {
    qashqai: {
      "2023-2024": {
        "1.3L Turbo (HR13DDT)": {
          capacity: "5.4 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "ACEA C3 / API SN or SP"
        }
      },
      "2024 e-POWER": {
        "1.5L e-POWER (KR15DDT)": {
          capacity: "5.1 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN or SP / ILSAC GF-5 or GF-6"
        }
      }
    },
    "x-trail": {
      "2024": {
        "2.5L": {
          capacity: "4.7 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SP / ILSAC GF-6A"
        }
      }
    },
    "murano hybrid": {
      "2020-2025": {
        "2.5L Hybrid (QR25DER)": {
          capacity: "4.6 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    patrol: {
      "2023-2025": {
        "5.6L V8 (VK56VD)": {
          capacity: "6.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    juke: {
      "2019-2025": {
        "1.5L (HR15DE)": {
          capacity: "4.4 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "SAE 0W-20 (Synthetic)"
        },
        "1.5L DIG-T": {
          capacity: "4.2 L",
          viscosity: "0W-30",
          oilType: "Full Synthetic",
          apiSpec: "SAE 0W-30"
        }
      }
    },
    note: {
      "2016-2021": {
        "1.6L (HR16DE)": {
          capacity: "3.6 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SM"
        },
        "1.0L Turbo (HR10DDT)": {
          capacity: "3.2 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    micra: {
      "2022-2025": {
        "1.2L 3-cyl (HR12DE)": {
          capacity: "3.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        }
      }
    },
    ariya: {
      "2022-2025 EV": {
        EV: {
          capacity: "Not Applicable",
          viscosity: "Not Applicable",
          oilType: "Not Applicable",
          apiSpec: "Not Applicable"
        }
      }
    },
    titan: {
      "2023-2025": {
        "5.6L V8 (VK56VD)": {
          capacity: "6.5 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN / SP"
        }
      }
    },
    stanza: {
      "1985-1990": {
        "2.0L (CA20E)": {
          capacity: "3.5 L",
          viscosity: "10W-30",
          oilType: "Conventional",
          apiSpec: "SAE 10W-30"
        }
      }
    },
    z: {
      "2023-2025": {
        "3.0L Twin-Turbo V6 (VR30DDTT)": {
          capacity: "5.2 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "SAE 0W-20 (Synthetic)"
        }
      }
    }
  };
  
  // Suzuki data (added per user request)
  const suzuki: any = {
    swift: {
      "2020-2024": {
        "1.2L (K12C)": {
          capacity: "3.3 L",
          viscosity: "0W-20 / 5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        },
        "1.4L Sport (K14C)": {
          capacity: "3.7 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        }
      },
      "2010-2019": {
        "1.2L (K12B)": {
          capacity: "3.1 L",
          viscosity: "0W-20 / 5W-30",
          oilType: "Semi Synthetic",
          apiSpec: "API SL"
        },
        "1.3L Diesel (D13A)": {
          capacity: "3.2 L",
          viscosity: "5W-30",
          oilType: "Semi Synthetic",
          apiSpec: "API SN"
        },
        "1.6L (M16A)": {
          capacity: "3.9 L",
          viscosity: "0W-20 / 5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      },
      "2004-2009": {
        "1.3L (M13A)": {
          capacity: "4.2 L",
          viscosity: "5W-30 / 5W-40",
          oilType: "Conventional",
          apiSpec: "API SL"
        }
      },
      "2004-2009 Diesel": {
        "1.3L Diesel (Z13DT)": {
          capacity: "3.2 L",
          viscosity: "5W-30",
          oilType: "Conventional",
          apiSpec: "API SL"
        }
      }
    },
  
    ertiga: {
      "2018-2024": {
        "1.5L Petrol (K15B)": {
          capacity: "3.6 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        },
        "1.3L Diesel (D13A)": {
          capacity: "3.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
  
    baleno: {
      "2016-2024": {
        "1.2L DualJet": {
          capacity: "3.5 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        }
      }
    },
  
    ciaz: {
      "2014-2023": {
        "1.4L (K14B)": {
          capacity: "3.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        }
      }
    },
  
    jimny: {
      "2018-2024": {
        "1.5L (K15B)": {
          capacity: "3.7 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        }
      },
      "1998-2018": {
        "1.3L (M13A)": {
          capacity: "3.5 L",
          viscosity: "5W-30",
          oilType: "Conventional",
          apiSpec: "API SJ/SL"
        }
      }
    },
  
    vitara: {
      "2015-2024": {
        "1.6L BoosterJet (T16A)": {
          capacity: "4.1 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "2.4L (J24B)": {
          capacity: "5.8 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
  
    "s-cross": {
      "2014-2024": {
        "1.6L Petrol (M16A)": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        },
        "1.6L Diesel (D16AA)": {
          capacity: "5.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API CI-4"
        }
      }
    },
  
    eeco: {
      "2015-2024": {
        "1.2L Petrol (K12B)": {
          capacity: "3.7 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        }
      }
    },
  
    k10: {
      "2014-2024": {
        "1.0L (K10B)": {
          capacity: "3.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        }
      }
    },
  
    "e-power": {
      "2022-2024": {
        Hybrid: {
          capacity: "4.6 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
  
    ignis: {
      "2017-2024": {
        "1.2L (K12M)": {
          capacity: "3.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SL"
        }
      }
    },
  
    swift_ev: {
      "2023-2025": {
        EV: {
          capacity: "Not Applicable",
          viscosity: "Not Applicable",
          oilType: "Not Applicable",
          apiSpec: "Not Applicable"
        }
      }
    }
  };
  
  // Jetour data (added per user request)
  const jetour: any = {
    x70: {
      "2018-2024": {
        "1.5L Turbo (SQRE4T15C)": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        }
      }
    },
    x70_m: {
      "2020-2024": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        }
      }
    },
    x70_plus: {
      "2022-2024": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30 / 5W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        },
        "1.6L Turbo (Coupe variant)": {
          capacity: "4.7 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        }
      }
    },
    x70_c_dm: {  // PHEV variant
      "2024-2024": {
        "1.5L Turbo PHEV": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    x70_pro: {
      "2023-2024": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    x90: {
      "2019-2023": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    x90_plus: {
      "2021-2023": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    x90_pro: {
      "2024-2024": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    shanhai_l6: {
      "2024-2024": {
        "PHEV 1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    shanhai_l7: {
      "2024-2025": {
        "PHEV 1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    traveller_t2: {
      "2023-2024": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        },
        "PHEV 1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    freedom_t1: {
      "2024-2024": {
        "1.5L Turbo": {
          capacity: "4.7 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or SP"
        },
        "PHEV 1.5L Turbo": {
          capacity: "4.7 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    shanhai_t1: {
      "2024-2025": {
        "PHEV 1.5L Turbo": {
          capacity: "4.7 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    dashing: {
      "2022-2024": {
        "1.5L Turbo": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN or above"
        }
      }
    },
    shanhai_l6_phev_variant: {
      "2024-2024": {
        "PHEV 1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    x95: {
      "2020-2025": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    ice_cream_ev: {
      "2023-2025": {
        EV: {
          capacity: "Not Applicable",
          viscosity: "Not Applicable",
          oilType: "Not Applicable",
          apiSpec: "Not Applicable"
        }
      }
    }
  };
  
  // Chery data (Omoda & Jaecoo) (added per user request)
  const chery: CarModel = {
    arrizo_5: {
      "2017-2025": {
        "1.5L": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    arrizo_6: {
      "2018-2025": {
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_2: {
      "2017-2025": {
        "1.5L": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_3: {
      "2016-2025": {
        "1.5L": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_4: {
      "2019-2025": {
        "1.5L": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_5x: {
      "2018-2025": {
        "1.5L": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_7: {
      "2017-2025": {
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_7_pro: {
      "2021-2025": {
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_8: {
      "2018-2025": {
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "1.6L Turbo": {
          capacity: "5.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    tiggo_8_pro: {
      "2021-2025": {
        "1.6L Turbo": {
          capacity: "5.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "2.0L Turbo": {
          capacity: "5.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    omoda_c5: {
      "2023-2025": {
        "1.6L Turbo": {
          capacity: "5.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "1.5L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    jaecoo_j7: {
      "2024-2025": {
        "1.6L Turbo": {
          capacity: "5.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    jaecoo_j8: {
      "2024-2025": {
        "2.0L Turbo": {
          capacity: "5.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    }
  };
  
  // Geely data (added per user request)
  const geely: any = {
    coolray_binyue: {
      "2018-2025": {
        "1.5L Turbo (JLH-3G15TD)": {
          capacity: "5.6 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN Plus / Volvo VCC RBS0-2AE"
        }
      }
    },
    tugella_xingyue: {
      "2019-2025": {
        "2.0L Turbo (JLH-4G20TDB)": {
          capacity: "5.6 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN / Volvo VCC RBS0-2AE"
        },
        "1.5L Turbo Hybrid": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    okavango: {
      "2020-2025": {
        "1.5L Turbo Hybrid (48V EMS)": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    geometry_c: {
      "2020-2025 EV": {
        EV: {
          capacity: "Not Applicable",
          viscosity: "Not Applicable",
          oilType: "Not Applicable",
          apiSpec: "Not Applicable"
        }
      }
    },
    emgrand_ec7: {
      "2010-2015": {
        "1.8L": {
          capacity: "4.0 L",
          viscosity: "5W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    emgrand_ec8: {
      "2010-2016": {
        "2.0L": {
          capacity: "3.8 L",
          viscosity: "5W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    emgrand_gl: {
      "2016-2020": {
        "1.8L": {
          capacity: "3.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    emgrand_x7: {
      "2013-2016": {
        "1.8L": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    }
  };
  
  // Changan data (added per user request)
  const changan: CarModel = {
    cs75: {
      "2013-2025": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "2.0L Turbo": {
          capacity: "5.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    cs75_plus: {
      "2019-2025": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    cs35_plus: {
      "2018-2025": {
        "1.6L (NA)": {
          capacity: "4.0 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "1.4L Turbo": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    "uni-v": {
      "2022-2025": {
        "1.5L Turbo": {
          capacity: "4.5 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SP"
        },
        "2.0L Turbo": {
          capacity: "5.5 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SP"
        },
        "1.5L Turbo Hybrid": {
          capacity: "4.2 L",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SP"
        }
      }
    }
  };

  // Great Wall Motor (GWM / Haval) data (added per user request)
  const great_wall_motor: CarModel = {
    haval_h6: {
      "2011-2017": {
        "1.5L Turbo (GW4G15B)": {
          capacity: "4.3 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "2.0L Turbo (GW4C20A)": {
          capacity: "4.8 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      },
      "2020-present": {
        "2.0L Turbo (GW4C20B)": {
          capacity: "5.0 L",
          viscosity: "5W-30 or 0W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "1.5L Turbo Hybrid (GW4B15A)": {
          capacity: "4.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    haval_h2: {
      "2014-2021": {
        "1.5L Turbo (GW4G15B)": {
          capacity: "4.2 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },
    haval_h9: {
      "2015-present": {
        "2.0L Turbo (GW4C20)": {
          capacity: "5.5 L",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    }
  };
  
  // Kia data (GCC-focused, official/manual sourced)
  const dodge: CarModel = {
    challenger: {
      "2023": {
        "3.6L V6": {
          capacity: "5.9 qt",
          viscosity: "5W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "5.7L V8": {
          capacity: "7 qt",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "6.2L V8 Supercharged": {
          capacity: "7 qt",
          viscosity: "0W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "6.4L V8": {
          capacity: "7 qt",
          viscosity: "0W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },

    charger: {
      "2022": {
        "3.6L V6": {
          capacity: "5.9 qt",
          viscosity: "5W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "5.7L V8": {
          capacity: "7 qt",
          viscosity: "5W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "6.4L V8": {
          capacity: "7 qt",
          viscosity: "0W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "6.2L V8 Hellcat": {
          capacity: "7 qt",
          viscosity: "0W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },

    ram_1500: {
      "2024-2025": {
        "3.6L V6 Pentastar": {
          capacity: "5.9 qt (≈5.6 L)",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "5.7L V8 HEMI": {
          capacity: "7 qt (≈6.6 L)",
          viscosity: "5W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "3.0L EcoDiesel V6": {
          capacity: "10.5 qt (≈9.9 L)",
          viscosity: "5W-40",
          oilType: "Full Synthetic",
          apiSpec: "API CK-4"
        }
      }
    }
  };

  const jeep: CarModel = {
    wrangler: {
      "2018-2025": {
        "3.6L V6": {
          capacity: "5 qt (4.7 L)",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "2.0L Turbo I4": {
          capacity: "5 qt (4.7 L)",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "3.0L EcoDiesel": {
          capacity: "9 qt (8.5 L)",
          viscosity: "5W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "2.0L Turbo Hybrid (4xe)": {
          capacity: "5 qt (4.7 L)",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "6.4L Hemi V8 (392)": {
          capacity: "6.7 qt",
          viscosity: "0W-40",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        }
      }
    },

    compass: {
      "2007-2025": {
        "2.0L I4": {
          capacity: "4.5 qt (4.26 L)",
          viscosity: "5W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SN"
        },
        "2.4L I4": {
          capacity: "5.5 qt (5.2 L)",
          viscosity: "0W-20 (2018-2022), 5W-30 (2023-2025)",
          oilType: "Full Synthetic",
          apiSpec: "API SN / GF-6A"
        }
      }
    },

    grand_cherokee: {
      "2023-2025": {
        "2.0L Turbo 4xe PHEV": {
          capacity: "5 qt (4.7 L)",
          viscosity: "5W-30",
          oilType: "Full Synthetic",
          apiSpec: "API SP"
        },
        "3.6L V6": {
          capacity: "5 qt (4.7 L)",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SP"
        },
        "5.7L V8": {
          capacity: "7 qt (6.6 L)",
          viscosity: "0W-20",
          oilType: "Full Synthetic",
          apiSpec: "API SP"
        }
      }
    }
  };

  const kia: CarModel = {
  rio: {
    "2012-2016": {
      "1.25L Kappa Petrol": {
        capacity: "3.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A3 / A5", // from oil grades PDF
      },
      "1.4L Gamma Petrol": {
        capacity: "3.3 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      },
      "1.5L Diesel U": {
        capacity: "5.3 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API CH-4 / ACEA B4", // referenced
      }
    },
    "2017-2020": {
      "1.25L Kappa DPi Petrol": {
        capacity: "3.4 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS", // referenced
      },
      "1.0L T-GDi Petrol": {
        capacity: "3.6 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS", // referenced
      }
    }
  },

  stonic: {
    "2018-2020": {
      "1.0L T-GDi Petrol": {
        capacity: "3.6 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA C2", // referenced
      },
      "1.4L Petrol": {
        capacity: "3.5 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "ACEA C2", // referenced
      }
    },
    "2021-on": {
      "1.0L T-GDi / MHEV Petrol": {
        capacity: "3.6 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS", // referenced
      }
    }
  },

  soul: {
    "2009-2011": {
      "1.6L Petrol": {
        capacity: "3.3 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SJ/SL", // referenced
      }
    },
    "2015-2016": {
      "1.6L Petrol": {
        capacity: "3.6 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // includes 0W-40 et al.
      }
    },
    "2017-2018": {
      "1.6L T-GDi Petrol": {
        capacity: "4.0 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      }
    }
  },

  ceed: {
    "2016-2018": {
      "1.0L T-GDi Petrol": {
        capacity: "3.6 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA C2", // referenced
      },
      "1.4L Petrol": {
        capacity: "3.6 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      },
      "1.6L Petrol": {
        capacity: "3.6 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      }
    },
    "2019-2020": {
      "1.0L T-GDi Petrol": {
        capacity: "3.6 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA C2", // referenced
      },
      "1.4L T-GDi Petrol": {
        capacity: "4.2 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA C2", // referenced
      },
      "1.6L Diesel U-III": {
        capacity: "4.4 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA C5 / C2 / C3", // referenced
      }
    },
    "2020-on": {
      "1.6L Plug-in Hybrid": {
        capacity: "3.8 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      }
    }
  },

  niro: {
    "2017-2022 HEV/PHEV": {
      "1.6L Hybrid": {
        capacity: "3.8 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      }
    },
    "2023-on HEV": {
      "1.6L Hybrid": {
        capacity: "3.8 L",
        viscosity: "0W-16",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS / SP", // referenced
      }
    }
  },

  sportage: {
    "2016-2018 QL": {
      "1.6L Petrol": {
        capacity: "3.6 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      },
      "1.6L T-GDi Petrol": {
        capacity: "4.0 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA A5", // referenced
      },
      "1.7L Diesel": {
        capacity: "5.3 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "ACEA C2 / C3", // referenced
      }
    },
    "2021-2024": {
      "2.0L MPI": {
        capacity: "4.0 L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS / SP or ILSAC GF-6",
      },
      "1.6L T-GDI": {
        capacity: "4.5 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS / SP or ACEA A5",
      }
    }
  },

  sorento: {
    "2021-2024": {
      "2.5L GDI": {
        capacity: "4.8 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP or above",
      }
    }
  },
};

// Chevrolet data (added per user request)
const chevrolet: any = {
  spark: {
    "2015-2024": {
      "1.4L (LUV) I4": {
        capacity: "3.7 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SN"
      }
    }
  },
  sonic: {
    "2012-2019": {
      "1.8L (LUJ) I4": {
        capacity: "4.2 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SN"
      }
    }
  },
  cruze: {
    "2011-2019": {
      "1.4L Turbo (LUJ/LUZ) I4": {
        capacity: "4.2 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SN"
      },
      "1.6L Diesel": {
        capacity: "4.6 L",
        viscosity: "5W-30 (diesel)",
        oilType: "Full Synthetic",
        apiSpec: "API CJ-4 / ACEA C3"
      }
    }
  },
  malibu: {
    "2016-2024": {
      "1.5L Turbo (L3A) I4": {
        capacity: "4.2 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "2.0L Turbo (LTG) I4": {
        capacity: "5.3 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      }
    }
  },
  equinox: {
    "2018-2024": {
      "1.5L Turbo (LKH) I4": {
        capacity: "4.2 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "2.0L Turbo (LTG) I4": {
        capacity: "5.3 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "1.6L Diesel (where sold)": {
        capacity: "5.0 L",
        viscosity: "5W-30 (diesel)",
        oilType: "Full Synthetic",
        apiSpec: "API CJ-4"
      }
    }
  },
  trax: {
    "2017-2024": {
      "1.4L Turbo": {
        capacity: "4.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      }
    }
  },
  trailblazer: {
    "2021-2024": {
      "1.2L Turbo (3-cylinder)": {
        capacity: "4.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      }
    }
  },
  blazer: {
    "2019-2024": {
      "2.0L Turbo": {
        capacity: "5.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "3.6L V6": {
        capacity: "5.7 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      }
    }
  },
  traverse: {
    "2018-2024": {
      "3.6L V6 (LFY/LFX)": {
        capacity: "5.7 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      }
    }
  },
  equinox_ev: {
    "2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  },
  impala: {
    "2014-2020": {
      "3.6L V6": {
        capacity: "5.7 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SN"
      }
    }
  },
  camaro: {
    "2016-2024": {
      "2.0L Turbo": {
        capacity: "4.8 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "3.6L V6": {
        capacity: "5.7 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "6.2L V8": {
        capacity: "8.0 L",
        viscosity: "0W-40 / 5W-40 (performance)",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      }
    }
  },
  corvette: {
    "2014-2024": {
      "6.2L LT1 / LT2 / LT4": {
        capacity: "6.9 L",
        viscosity: "0W-40 / 5W-40 (high-performance)",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      }
    }
  },
  silverado_1500: {
    "2019-2024": {
      "4.3L V6": {
        capacity: "5.7 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "5.3L V8 (V8 EcoTec3)": {
        capacity: "6.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "6.2L V8": {
        capacity: "7.6 L",
        viscosity: "0W-20 / 5W-30 (heavy use)",
        oilType: "Full Synthetic",
        apiSpec: "dexos1 / API SP"
      },
      "3.0L Duramax Diesel (LM2)": {
        capacity: "9.0 L",
        viscosity: "5W-40 (diesel)",
        oilType: "Full Synthetic",
        apiSpec: "API CK-4"
      }
    }
  },
  silverado_hd: {
    "2020-2024": {
      "6.6L Duramax V8 Diesel": {
        capacity: "15.0 L",
        viscosity: "15W-40 (diesel heavy duty)",
        oilType: "Full Synthetic",
        apiSpec: "API CK-4"
      }
    }
  },
  colorado: {
    "2015-2024": {
      "2.8L Duramax Diesel": {
        capacity: "8.5 L",
        viscosity: "5W-40 (diesel)",
        oilType: "Full Synthetic",
        apiSpec: "API CJ-4 / CK-4"
      }
    }
  }
};

// Genesis data (added per user request)
const genesis: any = {
  g70: {
    "2019-2024": {
      "2.0L Turbo": {
        capacity: "5.1 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS / SP"
      },
      "3.3L Turbo V6": {
        capacity: "6.0 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS / SP"
      },
      "2.5L Turbo": {
        capacity: "5.7 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      }
    }
  },
  g80: {
    "2017-2024": {
      "2.5L Turbo": {
        capacity: "5.7 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      },
      "3.5L Turbo V6": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      },
      "3.8L V6 (Older)": {
        capacity: "6.0 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN"
      }
    }
  },
  g90: {
    "2017-2024": {
      "3.3L Turbo V6": {
        capacity: "6.0 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN PLUS"
      },
      "3.5L Turbo V6": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      },
      "5.0L V8 (Older)": {
        capacity: "7.6 L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SN"
      }
    }
  },
  gv60: {
    "2022-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  },
  gv70: {
    "2021-2024": {
      "2.5L Turbo": {
        capacity: "5.7 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      },
      "3.5L Turbo V6": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      },
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  },
  gv80: {
    "2020-2024": {
      "2.5L Turbo": {
        capacity: "5.7 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      },
      "3.5L Turbo V6": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "API SP"
      }
    }
  }
};

// BMW (2018–2024) data (added per user request)
const bmw: any = {
  series_1: {
    "2018-2024": {
      "118i 1.5L": {
        capacity: "4.25 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-17FE+"
      },
      "120i 2.0L": {
        capacity: "5.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      }
    }
  },
  series_3: {
    "2018-2024": {
      "320i 2.0L": {
        capacity: "5.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      },
      "330i 2.0L": {
        capacity: "5.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      },
      "M340i 3.0L": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      }
    }
  },
  series_5: {
    "2018-2024": {
      "520i 2.0L": {
        capacity: "5.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      },
      "530i 2.0L": {
        capacity: "5.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      },
      "540i 3.0L": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      }
    }
  },
  series_7: {
    "2018-2024": {
      "740i 3.0L": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      },
      "750i 4.4L V8": {
        capacity: "8.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      }
    }
  },
  x3: {
    "2018-2024": {
      "2.0L": {
        capacity: "5.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      }
    }
  },
  x5: {
    "2018-2024": {
      "3.0L": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      }
    }
  },
  x7: {
    "2018-2024": {
      "3.0L": {
        capacity: "6.5 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "BMW LL-01"
      }
    }
  },
  i4: {
    "2018-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  },
  ix: {
    "2018-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  },
  i7: {
    "2018-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  }
};

// Mercedes-Benz (2018–2024) data (added per user request)
const mercedes_benz: any = {
  a_class: {
    "2018-2024": {
      "A180 1.3L": {
        capacity: "5.2 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.71"
      },
      "A200 1.3L": {
        capacity: "5.2 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.71"
      }
    }
  },
  c_class: {
    "2018-2024": {
      "C180 1.6L": {
        capacity: "5.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.71"
      },
      "C200 2.0L": {
        capacity: "6.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.71"
      },
      "C300 2.0L": {
        capacity: "6.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.71"
      }
    }
  },
  e_class: {
  "2018-2024": {
    "E200 2.0L": {
      capacity: "6.5 L",
      viscosity: "0W-30 / 0W-40",
      oilType: "Full Synthetic",
      apiSpec: "MB 229.5 / 229.52"
    },
    "E300 2.0L": {
      capacity: "6.9 L",
      viscosity: "0W-30 / 0W-40",
      oilType: "Full Synthetic",
      apiSpec: "MB 229.5 / 229.52"
    },
    "E450 3.0L": {
      capacity: "7.0 L",
      viscosity: "0W-30 / 0W-40",
      oilType: "Full Synthetic",
      apiSpec: "MB 229.5 / 229.52"
    }
  }
},
  s_class: {
    "2018-2024": {
      "S450 3.0L": {
        capacity: "7.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.51"
      },
      "S500 3.0L": {
        capacity: "7.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.51"
      },
      "S580 4.0L V8": {
        capacity: "8.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.51"
      }
    }
  },
  gla: {
    "2018-2024": {
      "2.0L": {
        capacity: "6.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.71"
      }
    }
  },
  glc: {
    "2018-2024": {
      "2.0L": {
        capacity: "6.0 L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.71"
      }
    }
  },
  gle: {
    "2018-2024": {
      "3.0L": {
        capacity: "7.0 L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        apiSpec: "MB 229.51"
      }
    }
  },
  eqc: {
    "2018-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  },
  eqs: {
    "2018-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  },
  eqa: {
    "2018-2024": {
      EV: {
        capacity: "Not Applicable",
        viscosity: "Not Applicable",
        oilType: "Not Applicable",
        apiSpec: "Not Applicable"
      }
    }
  }
};

// Initialize official specs with Hyundai
const officialSpecs: ManufacturerSpecs = {
  hyundai,
  kia,
  toyota,
  mg,
  nissan,
  suzuki,
  jetour,
  chery,
  geely,
  changan,
  great_wall_motor,
  dodge,
  jeep,
  chevrolet,
  genesis,
  bmw,
  mercedes_benz,
 }
 
 export default officialSpecs as any


