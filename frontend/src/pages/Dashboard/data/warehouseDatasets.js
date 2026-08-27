// Structured Master Datasets parsed from 'data gudang' (48 CSV Files)
// Supports full reactivity across OEM, REP, EXP and Product Categories (Tire, Tube, RIM Band)
// Combined Brand & Jenis Ban: IRC TUBELESS, IRC TUBETYPE, ZENEOS TUBELESS, ZENEOS TUBETYPE, etc.

export const WAREHOUSE_DATASETS = {
  "OEM": {
    "RIM_Band": {
      "actualVsSupply": [
        {
          "brand": "RIM BAND",
          "type": "RIM BAND",
          "category": "RIM BAND",
          "actual": 17994,
          "supplyPlan": 17994,
          "achievement": 100
        }
      ],
      "areaAchievement": [
        {
          "area": "JAKARTA",
          "actual": 13512,
          "target": 13512,
          "achievement": 75.09
        },
        {
          "area": "JAWA BARAT",
          "actual": 4482,
          "target": 4482,
          "achievement": 24.91
        }
      ],
      "dailyTruckPlan": [
        {
          "category": "Loading Hari Ini",
          "truckCount": 0,
          "tireQty": 2890,
          "color": "#003B73"
        },
        {
          "category": "Gulungan",
          "truckCount": 0,
          "tireQty": 135,
          "color": "#FF851B"
        },
        {
          "category": "Loading Selanjutnya",
          "truckCount": 0,
          "tireQty": 5300,
          "color": "#0074D9"
        }
      ],
      "soStatus": {
        "totalSO": 31639,
        "statuses": [
          {
            "label": "Closed",
            "count": 17994,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 12485,
            "color": "#FFB700"
          },
          {
            "label": "Booked",
            "count": 1160,
            "color": "#003B73"
          }
        ]
      },
      "warehouseSO": {
        "totalWarehouseSO": 30479,
        "statuses": [
          {
            "label": "Closed",
            "count": 17994,
            "percent": 59,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 10515,
            "percent": 34.5,
            "color": "#FFB700"
          },
          {
            "label": "Awaiting Delivery",
            "count": 1970,
            "percent": 6.5,
            "color": "#39CCCC"
          }
        ]
      },
      "bottleneckSKUs": [
        {
          "sku": "PXI2517-0",
          "pattern": "RIM BAND PXI2517-0",
          "brand": "RIM BAND",
          "fulfillment": 0,
          "demand": 0,
          "supply": 240
        },
        {
          "sku": "PXJ2702-0",
          "pattern": "RIM BAND PXJ2702-0",
          "brand": "RIM BAND",
          "fulfillment": 0,
          "demand": 0,
          "supply": 50
        },
        {
          "sku": "PXJ3202-0",
          "pattern": "RIM BAND PXJ3202-0",
          "brand": "RIM BAND",
          "fulfillment": 0,
          "demand": 0,
          "supply": 8155
        },
        {
          "sku": "PXK1719-0",
          "pattern": "RIM BAND PXK1719-0",
          "brand": "RIM BAND",
          "fulfillment": 0,
          "demand": 0,
          "supply": 580
        },
        {
          "sku": "PXM2701-0",
          "pattern": "RIM BAND PXM2701-0",
          "brand": "RIM BAND",
          "fulfillment": 0,
          "demand": 0,
          "supply": 8221
        }
      ]
    },
    "Tire": {
      "actualVsSupply": [
        {
          "brand": "IRC",
          "type": "TIRE IMPORT",
          "category": "IRC TIREIMPORT",
          "actual": 1465,
          "supplyPlan": 2760,
          "achievement": 53.08
        },
        {
          "brand": "IRC",
          "type": "TUBE TYPE",
          "category": "IRC TUBETYPE",
          "actual": 48729,
          "supplyPlan": 88951,
          "achievement": 54.78
        },
        {
          "brand": "IRC",
          "type": "TUBELESS",
          "category": "IRC TUBELESS",
          "actual": 405413,
          "supplyPlan": 669429,
          "achievement": 60.56
        }
      ],
      "areaAchievement": [
        {
          "area": "JAWA BARAT",
          "actual": 404538,
          "target": 404538,
          "achievement": 88.73
        },
        {
          "area": "JAKARTA",
          "actual": 51369,
          "target": 51369,
          "achievement": 11.27
        }
      ],
      "dailyTruckPlan": [
        {
          "category": "Loading Hari Ini",
          "truckCount": 33.4,
          "tireQty": 29952,
          "color": "#003B73"
        },
        {
          "category": "Gulungan",
          "truckCount": 1.8,
          "tireQty": 1640,
          "color": "#FF851B"
        },
        {
          "category": "Loading Selanjutnya",
          "truckCount": 53.9,
          "tireQty": 48203,
          "color": "#0074D9"
        }
      ],
      "rawProvinceDist": {
        "JAWA BARAT": {
          "gulungan": 1.8,
          "loadingHariIni": 28.3,
          "loadingSelanjutnya": 53.9
        },
        "JAKARTA": {
          "gulungan": 0,
          "loadingHariIni": 5.1,
          "loadingSelanjutnya": 0
        }
      },
      "soStatus": {
        "totalSO": 856534,
        "statuses": [
          {
            "label": "Closed",
            "count": 455907,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 399651,
            "color": "#FFB700"
          },
          {
            "label": "Booked",
            "count": 976,
            "color": "#003B73"
          }
        ]
      },
      "warehouseSO": {
        "totalWarehouseSO": 855558,
        "statuses": [
          {
            "label": "Closed",
            "count": 455907,
            "percent": 53.3,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 319856,
            "percent": 37.4,
            "color": "#FFB700"
          },
          {
            "label": "Awaiting Delivery",
            "count": 79795,
            "percent": 9.3,
            "color": "#39CCCC"
          }
        ]
      },
      "bottleneckSKUs": [
        {
          "sku": "IAF8019SP-0",
          "pattern": "IRC IAF8019SP-0",
          "brand": "IRC",
          "fulfillment": 25,
          "demand": 0,
          "supply": 5
        },
        {
          "sku": "IAF1007SP-0",
          "pattern": "IRC IAF1007SP-0",
          "brand": "IRC",
          "fulfillment": 33.33,
          "demand": 0,
          "supply": 10
        },
        {
          "sku": "IAI1011-0",
          "pattern": "IRC IAI1011-0",
          "brand": "IRC",
          "fulfillment": 19.23,
          "demand": 0,
          "supply": 50
        },
        {
          "sku": "IAI1205-0",
          "pattern": "IRC IAI1205-0",
          "brand": "IRC",
          "fulfillment": 21.43,
          "demand": 0,
          "supply": 60
        },
        {
          "sku": "IAM2703SP-0",
          "pattern": "IRC IAM2703SP-0",
          "brand": "IRC",
          "fulfillment": 27.7,
          "demand": 0,
          "supply": 118
        }
      ],
      "provinceTrucks": [
        {
          "province": "JAWA BARAT",
          "total": 84,
          "loadingHariIni": 28.3,
          "gulungan": 1.8,
          "loadingSelanjutnya": 53.9
        },
        {
          "province": "JAKARTA",
          "total": 5.1,
          "loadingHariIni": 5.1,
          "gulungan": 0,
          "loadingSelanjutnya": 0
        }
      ]
    },
    "Tube": {
      "actualVsSupply": [
        {
          "brand": "IRC",
          "type": "TUBE",
          "category": "IRC TUBE",
          "actual": 48539,
          "supplyPlan": 89882,
          "achievement": 54
        }
      ],
      "areaAchievement": [
        {
          "area": "JAWA BARAT",
          "actual": 35369,
          "target": 35369,
          "achievement": 72.42
        },
        {
          "area": "JAKARTA",
          "actual": 13470,
          "target": 13470,
          "achievement": 27.58
        }
      ],
      "dailyTruckPlan": [
        {
          "category": "Loading Hari Ini",
          "truckCount": 0,
          "tireQty": 2890,
          "color": "#003B73"
        },
        {
          "category": "Gulungan",
          "truckCount": 0,
          "tireQty": 135,
          "color": "#FF851B"
        },
        {
          "category": "Loading Selanjutnya",
          "truckCount": 0,
          "tireQty": 5300,
          "color": "#0074D9"
        }
      ],
      "provinceTrucks": [
        {
          "province": "JAWA BARAT",
          "total": 0,
          "loadingHariIni": 0,
          "gulungan": 0,
          "loadingSelanjutnya": 0,
          "truckCount": 0
        },
        {
          "province": "JAKARTA",
          "total": 0,
          "loadingHariIni": 0,
          "gulungan": 0,
          "loadingSelanjutnya": 0,
          "truckCount": 0
        }
      ],
      "soStatus": {
        "totalSO": 91947,
        "statuses": [
          {
            "label": "Closed",
            "count": 48839,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 42626,
            "color": "#FFB700"
          },
          {
            "label": "Booked",
            "count": 482,
            "color": "#003B73"
          }
        ]
      },
      "warehouseSO": {
        "totalWarehouseSO": 91465,
        "statuses": [
          {
            "label": "Closed",
            "count": 48839,
            "percent": 53.4,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 34301,
            "percent": 37.5,
            "color": "#FFB700"
          },
          {
            "label": "Awaiting Delivery",
            "count": 8325,
            "percent": 9.1,
            "color": "#39CCCC"
          }
        ]
      },
      "bottleneckSKUs": [
        {
          "sku": "THT2702-0",
          "pattern": "IRC TUBE THT2702-0",
          "brand": "IRC",
          "fulfillment": 41.33,
          "demand": 0,
          "supply": 124
        },
        {
          "sku": "ITI1001-0",
          "pattern": "IRC TUBE ITI1001-0",
          "brand": "IRC",
          "fulfillment": 24.07,
          "demand": 0,
          "supply": 130
        },
        {
          "sku": "THT3001-0",
          "pattern": "IRC TUBE THT3001-0",
          "brand": "IRC",
          "fulfillment": 37.14,
          "demand": 0,
          "supply": 260
        },
        {
          "sku": "ITI3001-0",
          "pattern": "IRC TUBE ITI3001-0",
          "brand": "IRC",
          "fulfillment": 35.35,
          "demand": 0,
          "supply": 1520
        },
        {
          "sku": "ITI2701-0",
          "pattern": "IRC TUBE ITI2701-0",
          "brand": "IRC",
          "fulfillment": 40.34,
          "demand": 0,
          "supply": 6500
        }
      ]
    }
  },
  "REP": {
    "Tire": {
      "actualVsSupply": [
        {
          "brand": "IRC",
          "type": "TUBE TYPE",
          "category": "IRC TUBETYPE",
          "achievement": 60.77,
          "actual": 588220,
          "supplyPlan": 967905
        },
        {
          "brand": "IRC",
          "type": "TUBELESS",
          "category": "IRC TUBELESS",
          "achievement": 62.75,
          "actual": 442390,
          "supplyPlan": 705000
        },
        {
          "brand": "ZENEOS",
          "type": "TUBELESS",
          "category": "ZENEOS TUBELESS",
          "achievement": 56.08,
          "actual": 84467,
          "supplyPlan": 150625
        }
      ],
      "multiYearTrend": [
        {
          "month": "Jan",
          "year2024": 1496418,
          "year2025": 1553183,
          "year2026": 1791280
        },
        {
          "month": "Feb",
          "year2024": 1382342,
          "year2025": 1465681,
          "year2026": 1641341
        },
        {
          "month": "Mar",
          "year2024": 1487859,
          "year2025": 1230243,
          "year2026": 1077224
        },
        {
          "month": "Apr",
          "year2024": 950844,
          "year2025": 1294392,
          "year2026": 1784963
        },
        {
          "month": "May",
          "year2024": 1437533,
          "year2025": 1571140,
          "year2026": 1628866
        },
        {
          "month": "Jun",
          "year2024": 1494677,
          "year2025": 1551809,
          "year2026": 1765348
        },
        {
          "month": "Jul",
          "year2024": 1557326,
          "year2025": 1787057,
          "year2026": 1995012
        },
        {
          "month": "Aug",
          "year2024": 1493439,
          "year2025": 1801125,
          "year2026": 1115297
        },
        {
          "month": "Sep",
          "year2024": 1492271,
          "year2025": 1624136,
          "year2026": null
        },
        {
          "month": "Oct",
          "year2024": 1686350,
          "year2025": 1705985,
          "year2026": null
        },
        {
          "month": "Nov",
          "year2024": 1575064,
          "year2025": 1668843,
          "year2026": null
        },
        {
          "month": "Dec",
          "year2024": 1649318,
          "year2025": 1805819,
          "year2026": null
        }
      ],
      "areaAchievement": [
        {
          "area": "KALIMANTAN",
          "actual": 74305,
          "target": 104200,
          "achievement": 71.31
        },
        {
          "area": "SUMATERA",
          "actual": 248440,
          "target": 363110,
          "achievement": 68.42
        },
        {
          "area": "JAWA BARAT",
          "actual": 97485,
          "target": 142501,
          "achievement": 68.41
        },
        {
          "area": "JAWA TENGAH",
          "actual": 260665,
          "target": 382319,
          "achievement": 68.18
        },
        {
          "area": "BALI & NUSA TENGGARA",
          "actual": 36920,
          "target": 55999,
          "achievement": 65.93
        },
        {
          "area": "JAWA TIMUR",
          "actual": 137417,
          "target": 221998,
          "achievement": 61.9
        },
        {
          "area": "JAKARTA",
          "actual": 98475,
          "target": 174015,
          "achievement": 56.59
        },
        {
          "area": "SULAWESI",
          "actual": 67805,
          "target": 135691,
          "achievement": 49.97
        },
        {
          "area": "BANTEN",
          "actual": 76500,
          "target": 155995,
          "achievement": 49.04
        },
        {
          "area": "PAPUA",
          "actual": 10240,
          "target": 21499,
          "achievement": 47.63
        },
        {
          "area": "MALUKU",
          "actual": 7045,
          "target": 14999,
          "achievement": 46.97
        }
      ],
      "spatialMapNational": [
        {
          "name": "West Kalimantan",
          "achievement": 101.5
        },
        {
          "name": "Kepulauan Riau",
          "achievement": 100.98
        },
        {
          "name": "Lampung",
          "achievement": 92.92
        },
        {
          "name": "Central Kalimantan",
          "achievement": 80.88
        },
        {
          "name": "West Nusa Tenggara",
          "achievement": 79.88
        },
        {
          "name": "Maluku",
          "achievement": 75.93
        },
        {
          "name": "Bali",
          "achievement": 69.82
        },
        {
          "name": "Central Java",
          "achievement": 69.72
        },
        {
          "name": "West Java",
          "achievement": 68.41
        },
        {
          "name": "North Sumatra",
          "achievement": 68.04
        },
        {
          "name": "Jambi",
          "achievement": 67.31
        },
        {
          "name": "West Sumatra",
          "achievement": 66.58
        },
        {
          "name": "Riau",
          "achievement": 66.43
        },
        {
          "name": "East Java",
          "achievement": 61.9
        },
        {
          "name": "Southeast Sulawesi",
          "achievement": 61.5
        },
        {
          "name": "South Kalimantan",
          "achievement": 59.24
        },
        {
          "name": "Central Sulawesi",
          "achievement": 57.43
        },
        {
          "name": "Jakarta",
          "achievement": 56.59
        },
        {
          "name": "North Kalimantan",
          "achievement": 56.14
        },
        {
          "name": "Bengkulu",
          "achievement": 56
        },
        {
          "name": "South Sumatra",
          "achievement": 53.83
        },
        {
          "name": "Banten",
          "achievement": 49.04
        },
        {
          "name": "South Sulawesi",
          "achievement": 44.81
        },
        {
          "name": "East Kalimantan",
          "achievement": 43.74
        },
        {
          "name": "East Nusa Tenggara",
          "achievement": 36.67
        },
        {
          "name": "Yogyakarta",
          "achievement": 35.21
        },
        {
          "name": "North Maluku",
          "achievement": 31.45
        },
        {
          "name": "North Sulawesi",
          "achievement": 27.09
        },
        {
          "name": "Central Papua",
          "achievement": 25.18
        },
        {
          "name": "Gorontalo",
          "achievement": 21.63
        },
        {
          "name": "Papua",
          "achievement": 17.07
        },
        {
          "name": "West Papua",
          "achievement": 11.15
        },
        {
          "name": "Bangka Belitung",
          "achievement": 6.25
        },
        {
          "name": "South West Papua",
          "achievement": 3.48
        }
      ],
      "spatialMapSub": {
        "IRC TUBETYPE": [
          {
            "name": "Central Kalimantan",
            "achievement": 137
          },
          {
            "name": "West Kalimantan",
            "achievement": 107
          },
          {
            "name": "West Nusa Tenggara",
            "achievement": 105
          },
          {
            "name": "South Kalimantan",
            "achievement": 103
          },
          {
            "name": "Lampung",
            "achievement": 98
          },
          {
            "name": "Bali",
            "achievement": 96
          },
          {
            "name": "West Java",
            "achievement": 90
          },
          {
            "name": "Jambi",
            "achievement": 77
          },
          {
            "name": "North Sumatra",
            "achievement": 74
          },
          {
            "name": "Central Sulawesi",
            "achievement": 73
          },
          {
            "name": "North Kalimantan",
            "achievement": 72
          },
          {
            "name": "Bengkulu",
            "achievement": 72
          },
          {
            "name": "Southeast Sulawesi",
            "achievement": 70
          },
          {
            "name": "West Sumatra",
            "achievement": 69
          },
          {
            "name": "Jakarta",
            "achievement": 68
          },
          {
            "name": "Central Java",
            "achievement": 68
          },
          {
            "name": "South Sumatra",
            "achievement": 64
          },
          {
            "name": "Riau",
            "achievement": 63
          },
          {
            "name": "East Java",
            "achievement": 62
          },
          {
            "name": "East Kalimantan",
            "achievement": 55
          },
          {
            "name": "South Sulawesi",
            "achievement": 52
          },
          {
            "name": "North Maluku",
            "achievement": 45
          },
          {
            "name": "Banten",
            "achievement": 42
          },
          {
            "name": "Kepulauan Riau",
            "achievement": 41
          },
          {
            "name": "East Nusa Tenggara",
            "achievement": 37
          },
          {
            "name": "Central Papua",
            "achievement": 28
          },
          {
            "name": "Yogyakarta",
            "achievement": 23
          },
          {
            "name": "Papua",
            "achievement": 19
          },
          {
            "name": "North Sulawesi",
            "achievement": 9
          },
          {
            "name": "Gorontalo",
            "achievement": 9
          },
          {
            "name": "West Papua",
            "achievement": 7
          }
        ],
        "IRC Tube Type": [
          {
            "name": "Central Kalimantan",
            "achievement": 137
          },
          {
            "name": "West Kalimantan",
            "achievement": 107
          },
          {
            "name": "West Nusa Tenggara",
            "achievement": 105
          },
          {
            "name": "South Kalimantan",
            "achievement": 103
          },
          {
            "name": "Lampung",
            "achievement": 98
          },
          {
            "name": "Bali",
            "achievement": 96
          },
          {
            "name": "West Java",
            "achievement": 90
          },
          {
            "name": "Jambi",
            "achievement": 77
          },
          {
            "name": "North Sumatra",
            "achievement": 74
          },
          {
            "name": "Central Sulawesi",
            "achievement": 73
          },
          {
            "name": "North Kalimantan",
            "achievement": 72
          },
          {
            "name": "Bengkulu",
            "achievement": 72
          },
          {
            "name": "Southeast Sulawesi",
            "achievement": 70
          },
          {
            "name": "West Sumatra",
            "achievement": 69
          },
          {
            "name": "Jakarta",
            "achievement": 68
          },
          {
            "name": "Central Java",
            "achievement": 68
          },
          {
            "name": "South Sumatra",
            "achievement": 64
          },
          {
            "name": "Riau",
            "achievement": 63
          },
          {
            "name": "East Java",
            "achievement": 62
          },
          {
            "name": "East Kalimantan",
            "achievement": 55
          },
          {
            "name": "South Sulawesi",
            "achievement": 52
          },
          {
            "name": "North Maluku",
            "achievement": 45
          },
          {
            "name": "Banten",
            "achievement": 42
          },
          {
            "name": "Kepulauan Riau",
            "achievement": 41
          },
          {
            "name": "East Nusa Tenggara",
            "achievement": 37
          },
          {
            "name": "Central Papua",
            "achievement": 28
          },
          {
            "name": "Yogyakarta",
            "achievement": 23
          },
          {
            "name": "Papua",
            "achievement": 19
          },
          {
            "name": "North Sulawesi",
            "achievement": 9
          },
          {
            "name": "Gorontalo",
            "achievement": 9
          },
          {
            "name": "West Papua",
            "achievement": 7
          }
        ],
        "IRC TUBELESS": [
          {
            "name": "Kepulauan Riau",
            "achievement": 100
          },
          {
            "name": "Lampung",
            "achievement": 81
          },
          {
            "name": "West Nusa Tenggara",
            "achievement": 78
          },
          {
            "name": "Central Java",
            "achievement": 72
          },
          {
            "name": "West Kalimantan",
            "achievement": 72
          },
          {
            "name": "Riau",
            "achievement": 72
          },
          {
            "name": "Southeast Sulawesi",
            "achievement": 71
          },
          {
            "name": "West Sumatra",
            "achievement": 67
          },
          {
            "name": "East Java",
            "achievement": 60
          },
          {
            "name": "North Sumatra",
            "achievement": 60
          },
          {
            "name": "Yogyakarta",
            "achievement": 58
          },
          {
            "name": "North Kalimantan",
            "achievement": 57
          },
          {
            "name": "Bali",
            "achievement": 55
          },
          {
            "name": "Central Sulawesi",
            "achievement": 55
          },
          {
            "name": "Jakarta",
            "achievement": 53
          },
          {
            "name": "West Java",
            "achievement": 51
          },
          {
            "name": "Banten",
            "achievement": 48
          },
          {
            "name": "Jambi",
            "achievement": 46
          },
          {
            "name": "Central Kalimantan",
            "achievement": 43
          },
          {
            "name": "North Sulawesi",
            "achievement": 43
          },
          {
            "name": "South Sulawesi",
            "achievement": 42
          },
          {
            "name": "East Kalimantan",
            "achievement": 40
          },
          {
            "name": "South Kalimantan",
            "achievement": 34
          },
          {
            "name": "South Sumatra",
            "achievement": 32
          },
          {
            "name": "Central Papua",
            "achievement": 30
          },
          {
            "name": "Maluku",
            "achievement": 29
          },
          {
            "name": "Gorontalo",
            "achievement": 20
          },
          {
            "name": "West Papua",
            "achievement": 18
          },
          {
            "name": "Papua",
            "achievement": 17
          },
          {
            "name": "North Maluku",
            "achievement": 15
          },
          {
            "name": "Bangka Belitung",
            "achievement": 12
          },
          {
            "name": "South West Papua",
            "achievement": 5
          }
        ],
        "IRC Tubeless": [
          {
            "name": "Kepulauan Riau",
            "achievement": 100
          },
          {
            "name": "Lampung",
            "achievement": 81
          },
          {
            "name": "West Nusa Tenggara",
            "achievement": 78
          },
          {
            "name": "Central Java",
            "achievement": 72
          },
          {
            "name": "West Kalimantan",
            "achievement": 72
          },
          {
            "name": "Riau",
            "achievement": 72
          },
          {
            "name": "Southeast Sulawesi",
            "achievement": 71
          },
          {
            "name": "West Sumatra",
            "achievement": 67
          },
          {
            "name": "East Java",
            "achievement": 60
          },
          {
            "name": "North Sumatra",
            "achievement": 60
          },
          {
            "name": "Yogyakarta",
            "achievement": 58
          },
          {
            "name": "North Kalimantan",
            "achievement": 57
          },
          {
            "name": "Bali",
            "achievement": 55
          },
          {
            "name": "Central Sulawesi",
            "achievement": 55
          },
          {
            "name": "Jakarta",
            "achievement": 53
          },
          {
            "name": "West Java",
            "achievement": 51
          },
          {
            "name": "Banten",
            "achievement": 48
          },
          {
            "name": "Jambi",
            "achievement": 46
          },
          {
            "name": "Central Kalimantan",
            "achievement": 43
          },
          {
            "name": "North Sulawesi",
            "achievement": 43
          },
          {
            "name": "South Sulawesi",
            "achievement": 42
          },
          {
            "name": "East Kalimantan",
            "achievement": 40
          },
          {
            "name": "South Kalimantan",
            "achievement": 34
          },
          {
            "name": "South Sumatra",
            "achievement": 32
          },
          {
            "name": "Central Papua",
            "achievement": 30
          },
          {
            "name": "Maluku",
            "achievement": 29
          },
          {
            "name": "Gorontalo",
            "achievement": 20
          },
          {
            "name": "West Papua",
            "achievement": 18
          },
          {
            "name": "Papua",
            "achievement": 17
          },
          {
            "name": "North Maluku",
            "achievement": 15
          },
          {
            "name": "Bangka Belitung",
            "achievement": 12
          },
          {
            "name": "South West Papua",
            "achievement": 5
          }
        ],
        "ZENEOS TUBELESS": [
          {
            "name": "Kepulauan Riau",
            "achievement": 157
          },
          {
            "name": "Gorontalo",
            "achievement": 97
          },
          {
            "name": "East Java",
            "achievement": 91
          },
          {
            "name": "Maluku",
            "achievement": 89
          },
          {
            "name": "Bali",
            "achievement": 82
          },
          {
            "name": "Lampung",
            "achievement": 79
          },
          {
            "name": "Riau",
            "achievement": 78
          },
          {
            "name": "Banten",
            "achievement": 76
          },
          {
            "name": "Bengkulu",
            "achievement": 73
          },
          {
            "name": "Central Java",
            "achievement": 70
          },
          {
            "name": "West Java",
            "achievement": 69
          },
          {
            "name": "Jambi",
            "achievement": 60
          },
          {
            "name": "Jakarta",
            "achievement": 58
          },
          {
            "name": "North Sulawesi",
            "achievement": 45
          },
          {
            "name": "Southeast Sulawesi",
            "achievement": 39
          },
          {
            "name": "West Nusa Tenggara",
            "achievement": 28
          },
          {
            "name": "South Kalimantan",
            "achievement": 27
          },
          {
            "name": "Central Kalimantan",
            "achievement": 22
          },
          {
            "name": "West Sumatra",
            "achievement": 18
          },
          {
            "name": "East Kalimantan",
            "achievement": 14
          },
          {
            "name": "North Kalimantan",
            "achievement": 13
          },
          {
            "name": "Papua",
            "achievement": 12
          },
          {
            "name": "South Sumatra",
            "achievement": 7
          },
          {
            "name": "South West Papua",
            "achievement": 6
          },
          {
            "name": "Central Papua",
            "achievement": 5
          }
        ],
        "Zeneos Tubeless": [
          {
            "name": "Kepulauan Riau",
            "achievement": 157
          },
          {
            "name": "Gorontalo",
            "achievement": 97
          },
          {
            "name": "East Java",
            "achievement": 91
          },
          {
            "name": "Maluku",
            "achievement": 89
          },
          {
            "name": "Bali",
            "achievement": 82
          },
          {
            "name": "Lampung",
            "achievement": 79
          },
          {
            "name": "Riau",
            "achievement": 78
          },
          {
            "name": "Banten",
            "achievement": 76
          },
          {
            "name": "Bengkulu",
            "achievement": 73
          },
          {
            "name": "Central Java",
            "achievement": 70
          },
          {
            "name": "West Java",
            "achievement": 69
          },
          {
            "name": "Jambi",
            "achievement": 60
          },
          {
            "name": "Jakarta",
            "achievement": 58
          },
          {
            "name": "North Sulawesi",
            "achievement": 45
          },
          {
            "name": "Southeast Sulawesi",
            "achievement": 39
          },
          {
            "name": "West Nusa Tenggara",
            "achievement": 28
          },
          {
            "name": "South Kalimantan",
            "achievement": 27
          },
          {
            "name": "Central Kalimantan",
            "achievement": 22
          },
          {
            "name": "West Sumatra",
            "achievement": 18
          },
          {
            "name": "East Kalimantan",
            "achievement": 14
          },
          {
            "name": "North Kalimantan",
            "achievement": 13
          },
          {
            "name": "Papua",
            "achievement": 12
          },
          {
            "name": "South Sumatra",
            "achievement": 7
          },
          {
            "name": "South West Papua",
            "achievement": 6
          },
          {
            "name": "Central Papua",
            "achievement": 5
          }
        ]
      },
      "repSOPreview": {
        "IRC TUBELESS": [
          {
            "province": "JAKARTA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 53.1,
            "loadingHariIni": 8.7,
            "gulungan": 0.42,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "JAWA TENGAH",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 71.31,
            "loadingHariIni": 0.53,
            "gulungan": 4.84,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "JAWA TIMUR",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 60.42,
            "loadingHariIni": 0.65,
            "gulungan": 0.58,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "KALIMANTAN",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 47.13,
            "loadingHariIni": 5.16,
            "gulungan": 6.89,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "PAPUA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 55.09,
            "loadingHariIni": 12.23,
            "gulungan": 14.05,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "SULAWESI",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 52.56,
            "loadingHariIni": 8.26,
            "gulungan": 4.25,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "SUMATERA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 62,
            "loadingHariIni": 5.6,
            "gulungan": 5.29,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "BALI & NUSA TENGGARA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 52.98,
            "loadingHariIni": 0.85,
            "gulungan": 0,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "BANTEN",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 47.76,
            "loadingHariIni": 13.56,
            "gulungan": 0.23,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "JAWA BARAT",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 51.34,
            "loadingHariIni": 4.18,
            "gulungan": 1.04,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          },
          {
            "province": "MALUKU",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 23.46,
            "loadingHariIni": 0.92,
            "gulungan": 23.08,
            "brand": "IRC",
            "tireType": "TUBELESS",
            "category": "IRC TUBELESS"
          }
        ],
        "IRC TUBETYPE": [
          {
            "province": "JAKARTA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 68.32,
            "loadingHariIni": 0.67,
            "gulungan": 3.15,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "JAWA TENGAH",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 65.9,
            "loadingHariIni": 4.93,
            "gulungan": 5.09,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "JAWA TIMUR",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 62.04,
            "loadingHariIni": 5.28,
            "gulungan": 0.75,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "KALIMANTAN",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 96.88,
            "loadingHariIni": 2.21,
            "gulungan": 4.62,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "PAPUA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 45.25,
            "loadingHariIni": 3.75,
            "gulungan": 23.5,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "SULAWESI",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 47.68,
            "loadingHariIni": 17.62,
            "gulungan": 13.64,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "SUMATERA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 71.92,
            "loadingHariIni": 3.66,
            "gulungan": 7.11,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "BALI & NUSA TENGGARA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 86.52,
            "loadingHariIni": 20,
            "gulungan": 2.76,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "BANTEN",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 42.09,
            "loadingHariIni": 0.87,
            "gulungan": 3.46,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "JAWA BARAT",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 89.6,
            "loadingHariIni": 4.01,
            "gulungan": 0.81,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          },
          {
            "province": "MALUKU",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 51.82,
            "loadingHariIni": 7.27,
            "gulungan": 34.55,
            "brand": "IRC",
            "tireType": "TUBETYPE",
            "category": "IRC TUBETYPE"
          }
        ],
        "ZENEOS TUBELESS": [
          {
            "province": "JAKARTA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 57.84,
            "loadingHariIni": 20.59,
            "gulungan": 0.89,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "JAWA TENGAH",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 70.22,
            "loadingHariIni": 9.59,
            "gulungan": 0.65,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "JAWA TIMUR",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 91.43,
            "loadingHariIni": 7.88,
            "gulungan": 0.75,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "KALIMANTAN",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 36.89,
            "loadingHariIni": 20.44,
            "gulungan": 9.5,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "PAPUA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 22.4,
            "loadingHariIni": 3,
            "gulungan": 24.6,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "SULAWESI",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 49.1,
            "loadingHariIni": 14.1,
            "gulungan": 16.28,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "SUMATERA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 65.55,
            "loadingHariIni": 7.68,
            "gulungan": 17.2,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "BALI & NUSA TENGGARA",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 72.88,
            "loadingHariIni": 6.67,
            "gulungan": 5.46,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "BANTEN",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 75.6,
            "loadingHariIni": 14.7,
            "gulungan": 0,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "JAWA BARAT",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 68.57,
            "loadingHariIni": 12.14,
            "gulungan": 2.14,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          },
          {
            "province": "MALUKU",
            "targetEOW": 89.47,
            "targetMTD": 63.16,
            "closed": 89,
            "loadingHariIni": 0,
            "gulungan": 2.5,
            "brand": "ZENEOS",
            "tireType": "TUBELESS",
            "category": "ZENEOS TUBELESS"
          }
        ]
      },
      "dailyTruckPlan": [
        {
          "category": "Loading Hari Ini",
          "truckCount": 71,
          "tireQty": 102770,
          "color": "#003B73"
        },
        {
          "category": "Gulungan",
          "truckCount": 45,
          "tireQty": 78585,
          "color": "#FF851B"
        },
        {
          "category": "Loading Selanjutnya",
          "truckCount": 2,
          "tireQty": 6000,
          "color": "#0074D9"
        }
      ],
      "rawProvinceDist": {
        "JAKARTA": {
          "gulungan": 1.3,
          "loadingHariIni": 16.7,
          "loadingSelanjutnya": 0
        },
        "BANTEN": {
          "gulungan": 0.8,
          "loadingHariIni": 13.5,
          "loadingSelanjutnya": 0
        },
        "SULAWESI": {
          "gulungan": 9.1,
          "loadingHariIni": 11.3,
          "loadingSelanjutnya": 0
        },
        "SUMATERA": {
          "gulungan": 13.1,
          "loadingHariIni": 9.3,
          "loadingSelanjutnya": 0
        },
        "JAWA TENGAH": {
          "gulungan": 9.4,
          "loadingHariIni": 5.6,
          "loadingSelanjutnya": 1.9
        },
        "KALIMANTAN": {
          "gulungan": 4,
          "loadingHariIni": 4.3,
          "loadingSelanjutnya": 0
        },
        "JAWA BARAT": {
          "gulungan": 1.1,
          "loadingHariIni": 4.1,
          "loadingSelanjutnya": 0
        },
        "JAWA TIMUR": {
          "gulungan": 0.9,
          "loadingHariIni": 2.8,
          "loadingSelanjutnya": 0
        },
        "BALI & NUSA TENGGARA": {
          "gulungan": 0.7,
          "loadingHariIni": 2.3,
          "loadingSelanjutnya": 0
        },
        "PAPUA": {
          "gulungan": 2.5,
          "loadingHariIni": 1.2,
          "loadingSelanjutnya": 0
        },
        "MALUKU": {
          "gulungan": 1.9,
          "loadingHariIni": 0.2,
          "loadingSelanjutnya": 0
        }
      },
      "soStatus": {
        "totalSO": 3957108,
        "statuses": [
          {
            "label": "Booked",
            "count": 1383124,
            "color": "#003B73"
          },
          {
            "label": "Closed",
            "count": 1115297,
            "color": "#2ECC40"
          },
          {
            "label": "Entered",
            "count": 905395,
            "color": "#0074D9"
          },
          {
            "label": "Awaiting Shipping",
            "count": 553292,
            "color": "#FFB700"
          }
        ]
      },
      "warehouseSO": {
        "totalWarehouseSO": 1668589,
        "statuses": [
          {
            "label": "Closed",
            "count": 1115297,
            "percent": 66.8,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 365937,
            "percent": 21.9,
            "color": "#FFB700"
          },
          {
            "label": "Awaiting Delivery",
            "count": 187355,
            "percent": 11.2,
            "color": "#39CCCC"
          }
        ]
      },
      "bottleneckSKUs": {
        "IRC": [
          {
            "sku": "IAF1012-1",
            "pattern": "IRC IAF1012-1",
            "brand": "IRC",
            "category": "IRC",
            "supply": 5,
            "fulfillment": 1.67,
            "demand": 300
          },
          {
            "sku": "IBC3505-1",
            "pattern": "IRC IBC3505-1",
            "brand": "IRC",
            "category": "IRC",
            "supply": 75,
            "fulfillment": 3.11,
            "demand": 2415
          },
          {
            "sku": "IAI8013-1",
            "pattern": "IRC IAI8013-1",
            "brand": "IRC",
            "category": "IRC",
            "supply": 100,
            "fulfillment": 2.89,
            "demand": 3465
          },
          {
            "sku": "IAI7029-1",
            "pattern": "IRC IAI7029-1",
            "brand": "IRC",
            "category": "IRC",
            "supply": 200,
            "fulfillment": 5,
            "demand": 4000
          },
          {
            "sku": "IAI8025-1",
            "pattern": "IRC IAI8025-1",
            "brand": "IRC",
            "category": "IRC",
            "supply": 265,
            "fulfillment": 4.82,
            "demand": 5495
          }
        ],
        "ZENEOS": [
          {
            "sku": "PAF1201-1",
            "pattern": "Zeneos PAF1201-1",
            "brand": "ZENEOS",
            "category": "ZENEOS",
            "supply": 355,
            "fulfillment": 14.76,
            "demand": 2405
          },
          {
            "sku": "PAF8008-1",
            "pattern": "Zeneos PAF8008-1",
            "brand": "ZENEOS",
            "category": "ZENEOS",
            "supply": 650,
            "fulfillment": 21.67,
            "demand": 3000
          },
          {
            "sku": "PAI8014-1",
            "pattern": "Zeneos PAI8014-1",
            "brand": "ZENEOS",
            "category": "ZENEOS",
            "supply": 500,
            "fulfillment": 25.71,
            "demand": 1945
          },
          {
            "sku": "PAI7009-1",
            "pattern": "Zeneos PAI7009-1",
            "brand": "ZENEOS",
            "category": "ZENEOS",
            "supply": 75,
            "fulfillment": 27.27,
            "demand": 275
          },
          {
            "sku": "PAH7001-1",
            "pattern": "Zeneos PAH7001-1",
            "brand": "ZENEOS",
            "category": "ZENEOS",
            "supply": 20,
            "fulfillment": 28.57,
            "demand": 70
          }
        ]
      },
      "provinceTrucks": [
        {
          "province": "SUMATERA",
          "total": 22.4,
          "loadingHariIni": 9.3,
          "gulungan": 13.1,
          "loadingSelanjutnya": 0
        },
        {
          "province": "SULAWESI",
          "total": 20.4,
          "loadingHariIni": 11.3,
          "gulungan": 9.1,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAKARTA",
          "total": 18,
          "loadingHariIni": 16.7,
          "gulungan": 1.3,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAWA TENGAH",
          "total": 16.9,
          "loadingHariIni": 5.6,
          "gulungan": 9.4,
          "loadingSelanjutnya": 1.9
        },
        {
          "province": "BANTEN",
          "total": 14.3,
          "loadingHariIni": 13.5,
          "gulungan": 0.8,
          "loadingSelanjutnya": 0
        },
        {
          "province": "KALIMANTAN",
          "total": 8.3,
          "loadingHariIni": 4.3,
          "gulungan": 4,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAWA BARAT",
          "total": 5.2,
          "loadingHariIni": 4.1,
          "gulungan": 1.1,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAWA TIMUR",
          "total": 3.7,
          "loadingHariIni": 2.8,
          "gulungan": 0.9,
          "loadingSelanjutnya": 0
        },
        {
          "province": "PAPUA",
          "total": 3.7,
          "loadingHariIni": 1.2,
          "gulungan": 2.5,
          "loadingSelanjutnya": 0
        },
        {
          "province": "BALI & NUSA TENGGARA",
          "total": 3,
          "loadingHariIni": 2.3,
          "gulungan": 0.7,
          "loadingSelanjutnya": 0
        },
        {
          "province": "MALUKU",
          "total": 2.1,
          "loadingHariIni": 0.2,
          "gulungan": 1.9,
          "loadingSelanjutnya": 0
        }
      ]
    },
    "Tube": {
      "actualVsSupply": [
        {
          "brand": "IRC",
          "type": "TUBE",
          "category": "IRC TUBE",
          "achievement": 60.42,
          "actual": 1077930,
          "supplyPlan": 1784000
        }
      ],
      "areaAchievement": [
        {
          "area": "JAKARTA",
          "actual": 45990,
          "target": 50000,
          "achievement": 91.98
        },
        {
          "area": "SUMATERA",
          "actual": 368370,
          "target": 417511,
          "achievement": 88.23
        },
        {
          "area": "KALIMANTAN",
          "actual": 54390,
          "target": 93006,
          "achievement": 58.48
        },
        {
          "area": "BALI & NUSA TENGGARA",
          "actual": 25080,
          "target": 44000,
          "achievement": 57
        },
        {
          "area": "JAWA BARAT",
          "actual": 48720,
          "target": 91994,
          "achievement": 52.96
        },
        {
          "area": "JAWA TENGAH",
          "actual": 302400,
          "target": 595041,
          "achievement": 50.82
        },
        {
          "area": "BANTEN",
          "actual": 15030,
          "target": 30000,
          "achievement": 50.1
        },
        {
          "area": "JAWA TIMUR",
          "actual": 177900,
          "target": 419972,
          "achievement": 42.36
        },
        {
          "area": "SULAWESI",
          "actual": 40050,
          "target": 95997,
          "achievement": 41.72
        }
      ],
      "spatialMapNational": [
        {
          "name": "Kepulauan Riau",
          "achievement": 104.5
        },
        {
          "name": "Lampung",
          "achievement": 96.2
        },
        {
          "name": "Jambi",
          "achievement": 92.4
        },
        {
          "name": "Jakarta",
          "achievement": 91.98
        },
        {
          "name": "North Sumatra",
          "achievement": 89.1
        },
        {
          "name": "West Sumatra",
          "achievement": 86.8
        },
        {
          "name": "Riau",
          "achievement": 85.5
        },
        {
          "name": "South Sumatra",
          "achievement": 83.2
        },
        {
          "name": "Bengkulu",
          "achievement": 79.4
        },
        {
          "name": "West Kalimantan",
          "achievement": 76.5
        },
        {
          "name": "Bangka Belitung",
          "achievement": 74.0
        },
        {
          "name": "West Nusa Tenggara",
          "achievement": 69.4
        },
        {
          "name": "Central Kalimantan",
          "achievement": 68.2
        },
        {
          "name": "North Kalimantan",
          "achievement": 59.1
        },
        {
          "name": "Bali",
          "achievement": 58.5
        },
        {
          "name": "South Kalimantan",
          "achievement": 54.3
        },
        {
          "name": "West Java",
          "achievement": 52.96
        },
        {
          "name": "Southeast Sulawesi",
          "achievement": 52.4
        },
        {
          "name": "Central Java",
          "achievement": 51.5
        },
        {
          "name": "Banten",
          "achievement": 50.1
        },
        {
          "name": "Central Sulawesi",
          "achievement": 47.6
        },
        {
          "name": "East Kalimantan",
          "achievement": 46.8
        },
        {
          "name": "Yogyakarta",
          "achievement": 45.8
        },
        {
          "name": "East Nusa Tenggara",
          "achievement": 43.1
        },
        {
          "name": "East Java",
          "achievement": 42.36
        },
        {
          "name": "South Sulawesi",
          "achievement": 41.2
        },
        {
          "name": "Maluku",
          "achievement": 38.5
        },
        {
          "name": "North Sulawesi",
          "achievement": 33.5
        },
        {
          "name": "North Maluku",
          "achievement": 29.2
        },
        {
          "name": "Gorontalo",
          "achievement": 28.6
        },
        {
          "name": "Central Papua",
          "achievement": 24.5
        },
        {
          "name": "Papua",
          "achievement": 18.2
        },
        {
          "name": "West Papua",
          "achievement": 12.4
        },
        {
          "name": "South West Papua",
          "achievement": 8.5
        }
      ],
      "spatialMapSub": {
        "IRC TUBE": [
          {
            "name": "Kepulauan Riau",
            "achievement": 104.5
          },
          {
            "name": "Lampung",
            "achievement": 96.2
          },
          {
            "name": "Jambi",
            "achievement": 92.4
          },
          {
            "name": "Jakarta",
            "achievement": 91.98
          },
          {
            "name": "North Sumatra",
            "achievement": 89.1
          },
          {
            "name": "West Sumatra",
            "achievement": 86.8
          },
          {
            "name": "Riau",
            "achievement": 85.5
          },
          {
            "name": "South Sumatra",
            "achievement": 83.2
          },
          {
            "name": "Bengkulu",
            "achievement": 79.4
          },
          {
            "name": "West Kalimantan",
            "achievement": 76.5
          },
          {
            "name": "Bangka Belitung",
            "achievement": 74.0
          },
          {
            "name": "West Nusa Tenggara",
            "achievement": 69.4
          },
          {
            "name": "Central Kalimantan",
            "achievement": 68.2
          },
          {
            "name": "North Kalimantan",
            "achievement": 59.1
          },
          {
            "name": "Bali",
            "achievement": 58.5
          },
          {
            "name": "South Kalimantan",
            "achievement": 54.3
          },
          {
            "name": "West Java",
            "achievement": 52.96
          },
          {
            "name": "Southeast Sulawesi",
            "achievement": 52.4
          },
          {
            "name": "Central Java",
            "achievement": 51.5
          },
          {
            "name": "Banten",
            "achievement": 50.1
          },
          {
            "name": "Central Sulawesi",
            "achievement": 47.6
          },
          {
            "name": "East Kalimantan",
            "achievement": 46.8
          },
          {
            "name": "Yogyakarta",
            "achievement": 45.8
          },
          {
            "name": "East Nusa Tenggara",
            "achievement": 43.1
          },
          {
            "name": "East Java",
            "achievement": 42.36
          },
          {
            "name": "South Sulawesi",
            "achievement": 41.2
          },
          {
            "name": "Maluku",
            "achievement": 38.5
          },
          {
            "name": "North Sulawesi",
            "achievement": 33.5
          },
          {
            "name": "North Maluku",
            "achievement": 29.2
          },
          {
            "name": "Gorontalo",
            "achievement": 28.6
          },
          {
            "name": "Central Papua",
            "achievement": 24.5
          },
          {
            "name": "Papua",
            "achievement": 18.2
          },
          {
            "name": "West Papua",
            "achievement": 12.4
          },
          {
            "name": "South West Papua",
            "achievement": 8.5
          }
        ]
      },
      "dailyTruckPlan": [
        {
          "category": "Gulungan",
          "truckCount": 8,
          "tireQty": 190140,
          "color": "#FF851B"
        },
        {
          "category": "Loading Hari Ini",
          "truckCount": 1,
          "tireQty": 30390,
          "color": "#003B73"
        }
      ],
      "rawProvinceDist": {
        "SUMATERA": {
          "gulungan": 3.5,
          "loadingHariIni": 0,
          "loadingSelanjutnya": 0
        },
        "JAWA TENGAH": {
          "gulungan": 2.4,
          "loadingHariIni": 0.3,
          "loadingSelanjutnya": 0
        },
        "SULAWESI": {
          "gulungan": 0.6,
          "loadingHariIni": 0.1,
          "loadingSelanjutnya": 0
        },
        "JAWA BARAT": {
          "gulungan": 0.4,
          "loadingHariIni": 0.4,
          "loadingSelanjutnya": 0
        },
        "JAWA TIMUR": {
          "gulungan": 0.3,
          "loadingHariIni": 0,
          "loadingSelanjutnya": 0
        },
        "BANTEN": {
          "gulungan": 0.2,
          "loadingHariIni": 0,
          "loadingSelanjutnya": 0
        },
        "PAPUA": {
          "gulungan": 0.2,
          "loadingHariIni": 0,
          "loadingSelanjutnya": 0
        },
        "BALI & NUSA TENGGARA": {
          "gulungan": 0.2,
          "loadingHariIni": 0.2,
          "loadingSelanjutnya": 0
        },
        "MALUKU": {
          "gulungan": 0.1,
          "loadingHariIni": 0,
          "loadingSelanjutnya": 0
        },
        "KALIMANTAN": {
          "gulungan": 0.1,
          "loadingHariIni": 0.3,
          "loadingSelanjutnya": 0
        },
        "JAKARTA": {
          "gulungan": 0,
          "loadingHariIni": 0,
          "loadingSelanjutnya": 0
        }
      },
      "soStatus": {
        "totalSO": 3958410,
        "statuses": [
          {
            "label": "Booked",
            "count": 1417110,
            "color": "#003B73"
          },
          {
            "label": "Closed",
            "count": 1077930,
            "color": "#2ECC40"
          },
          {
            "label": "Entered",
            "count": 692040,
            "color": "#0074D9"
          },
          {
            "label": "Awaiting Shipping",
            "count": 771330,
            "color": "#FFB700"
          }
        ]
      },
      "warehouseSO": {
        "totalWarehouseSO": 1849260,
        "statuses": [
          {
            "label": "Closed",
            "count": 1077930,
            "percent": 58.3,
            "color": "#2ECC40"
          },
          {
            "label": "Awaiting Shipping",
            "count": 550800,
            "percent": 29.8,
            "color": "#FFB700"
          },
          {
            "label": "Awaiting Delivery",
            "count": 220530,
            "percent": 11.9,
            "color": "#39CCCC"
          }
        ]
      },
      "bottleneckSKUs": [
        {
          "sku": "ITI1003-1",
          "pattern": "IRC TUBE ITI1003-1",
          "brand": "IRC",
          "category": "IRC TUBE",
          "supply": 240,
          "fulfillment": 8.89,
          "demand": 2700
        },
        {
          "sku": "ITK2502-1",
          "pattern": "IRC TUBE ITK2502-1",
          "brand": "IRC",
          "category": "IRC TUBE",
          "supply": 480,
          "fulfillment": 15.69,
          "demand": 3059
        },
        {
          "sku": "ITH8002-1",
          "pattern": "IRC TUBE ITH8002-1",
          "brand": "IRC",
          "category": "IRC TUBE",
          "supply": 720,
          "fulfillment": 34.29,
          "demand": 2100
        },
        {
          "sku": "ITA3502-1",
          "pattern": "IRC TUBE ITA3502-1",
          "brand": "IRC",
          "category": "IRC TUBE",
          "supply": 1200,
          "fulfillment": 27.97,
          "demand": 4290
        },
        {
          "sku": "ITJ2202-1",
          "pattern": "IRC TUBE ITJ2202-1",
          "brand": "IRC",
          "category": "IRC TUBE",
          "supply": 1590,
          "fulfillment": 32.92,
          "demand": 4830
        }
      ],
      "provinceTrucks": [
        {
          "province": "SUMATERA",
          "total": 3.5,
          "loadingHariIni": 0,
          "gulungan": 3.5,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAWA TENGAH",
          "total": 2.7,
          "loadingHariIni": 0.3,
          "gulungan": 2.4,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAWA BARAT",
          "total": 0.8,
          "loadingHariIni": 0.4,
          "gulungan": 0.4,
          "loadingSelanjutnya": 0
        },
        {
          "province": "SULAWESI",
          "total": 0.7,
          "loadingHariIni": 0.1,
          "gulungan": 0.6,
          "loadingSelanjutnya": 0
        },
        {
          "province": "BALI & NUSA TENGGARA",
          "total": 0.4,
          "loadingHariIni": 0.2,
          "gulungan": 0.2,
          "loadingSelanjutnya": 0
        },
        {
          "province": "KALIMANTAN",
          "total": 0.4,
          "loadingHariIni": 0.3,
          "gulungan": 0.1,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAWA TIMUR",
          "total": 0.3,
          "loadingHariIni": 0,
          "gulungan": 0.3,
          "loadingSelanjutnya": 0
        },
        {
          "province": "BANTEN",
          "total": 0.2,
          "loadingHariIni": 0,
          "gulungan": 0.2,
          "loadingSelanjutnya": 0
        },
        {
          "province": "PAPUA",
          "total": 0.2,
          "loadingHariIni": 0,
          "gulungan": 0.2,
          "loadingSelanjutnya": 0
        },
        {
          "province": "MALUKU",
          "total": 0.1,
          "loadingHariIni": 0,
          "gulungan": 0.1,
          "loadingSelanjutnya": 0
        },
        {
          "province": "JAKARTA",
          "total": 0,
          "loadingHariIni": 0,
          "gulungan": 0,
          "loadingSelanjutnya": 0
        }
      ]
    }
  }
};
