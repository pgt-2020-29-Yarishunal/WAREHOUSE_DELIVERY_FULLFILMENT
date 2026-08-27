import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import './IndonesiaSalesMap.css';
import { Map, View } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import { ScaleLine, Zoom } from 'ol/control';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import indonesiaProvincesGeoJSON from '../data/indonesiaProvinces.json';

// Mapping between database province names (Indonesian, uppercase) and GeoJSON province names (English)
const provinceNameMapping = {
  'KALIMANTAN SELATAN': 'South Kalimantan',
  'DKI JAKARTA': 'Jakarta Raya',
  'JAWA BARAT': 'West Java',
  'JAWA TENGAH': 'Central Java',
  'SUMATERA BARAT': 'West Sumatra',
  'RIAU': 'Riau',
  'SUMATERA UTARA': 'North Sumatra',
  'LAMPUNG': 'Lampung',
  'KALIMANTAN BARAT': 'West Kalimantan',
  'KALIMANTAN TIMUR': 'East Kalimantan',
  'KALIMANTAN TENGAH': 'Central Kalimantan',
  'JAWA TIMUR': 'East Java',
  'SULAWESI TENGAH': 'Central Sulawesi',
  'MALUKU': 'Maluku',
  'SUMATERA SELATAN': 'South Sumatra',
  'KEPULAUAN BANGKA BELITUNG': 'Bangka Belitung Islands',
  'JAMBI': 'Jambi',
  'SULAWESI SELATAN': 'South Sulawesi',
  'KEPULAUAN RIAU': 'Riau Islands',
  'SULAWESI UTARA': 'North Sulawesi',
  'NUSA TENGGARA BARAT': 'West Nusa Tenggara',
  'KALIMANTAN UTARA': 'North Kalimantan',
  'SULAWESI TENGGARA': 'Southeast Sulawesi',
  'BENGKULU': 'Bengkulu',
  'PAPUA': 'Papua',
  'BALI': 'Bali',
  'NUSA TENGGARA TIMUR': 'East Nusa Tenggara',
  'MALUKU UTARA': 'North Maluku',
  'BANTEN': 'Banten',
  'DI YOGYAKARTA': 'Yogyakarta'
};

// Colors for customer categories - matching app purple theme
const CUSTOMER_COLORS = {
  'OK': '#C026D3',  // Vibrant fuchsia-purple for OK (Replacement)
  'OE': '#7C3AED',  // Vibrant violet-purple for OE (Original Equipment)
  'EXP': '#6366F1', // Vibrant indigo-purple for EXP (Export)
};

const IndonesiaSalesMap = ({ salesByRegion, salesByCustomerCategory, height = 600 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('cost_vs_sales_ratio'); // Default metric

  useEffect(() => {
    if (!salesByRegion || salesByRegion.length === 0) {
      return;
    }

    // Clean up previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(null);
      mapInstanceRef.current = null;
    }

    // Create sales data lookup map - province names from database should now match GeoJSON exactly
    const salesDataMap = {};
    salesByRegion.forEach(region => {
      const geoJSONName = region.name; // No mapping needed - names match directly
      salesDataMap[geoJSONName] = {
        total_sales: parseFloat(region.total_sales),
        quantity_sold: parseFloat(region.quantity_sold),
        total_cost: parseFloat(region.total_cost || 0),
        transport_cost: parseFloat(region.transport_cost || 0),
        cost_vs_sales_ratio: parseFloat(region.cost_vs_sales_ratio || 0),
        original_name: region.name
      };
    });

    console.log('🗺️ Sales data map built:', Object.keys(salesDataMap).length, 'provinces mapped');
    console.log('📋 Database province names:', salesByRegion.map(r => r.name));
    console.log('🎯 GeoJSON mapped names:', Object.keys(salesDataMap));

    // Calculate min and max for color scaling based on selected metric
    let metricValues = [];
    if (selectedMetric === 'transport_cost') {
      metricValues = salesByRegion.map(r => parseFloat(r.transport_cost || 0));
    } else { // cost_vs_sales_ratio
      metricValues = salesByRegion.map(r => parseFloat(r.cost_vs_sales_ratio || 0));
    }

    const minValue = Math.min(...metricValues);
    const maxValue = Math.max(...metricValues);

    // Function to get color based on metric value
    const getColor = (data) => {
      if (!data) return 'rgba(255, 255, 255, 0.9)'; // White for no data
      
      let value;
      if (selectedMetric === 'transport_cost') {
        value = data.transport_cost;
      } else { // cost_vs_sales_ratio
        value = data.cost_vs_sales_ratio;
      }

      if (!value) return 'rgba(255, 255, 255, 0.9)';
      
      const ratio = (value - minValue) / (maxValue - minValue);
      
      // For cost vs sales ratio, higher is worse (red), lower is better (green)
      // For transport cost, higher is worse (red), lower is better (yellow-green)
      if (selectedMetric === 'cost_vs_sales_ratio') {
        const hue = (1 - ratio) * 120; // Green (120) to Red (0)
        return `hsla(${hue}, 80%, 50%, 0.85)`;
      } else {
        const hue = (1 - ratio) * 120; // Green (120) to Red (0)
        return `hsla(${hue}, 80%, 50%, 0.85)`;
      }
    };

    // Create vector layer with Indonesia provinces
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(indonesiaProvincesGeoJSON, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
    });

    // Style function for provinces
    const styleFunction = (feature) => {
      const provinceName = feature.get('name');
      const salesData = salesDataMap[provinceName];
      
      if (!salesData) {
        console.warn(`⚠️ No data found for GeoJSON province: "${provinceName}"`);
      }
      
      return new Style({
        fill: new Fill({
          color: salesData ? getColor(salesData) : 'rgba(255, 255, 255, 0.9)'
        }),
        stroke: new Stroke({
          color: salesData ? '#333333' : '#999999',
          width: salesData ? 1.5 : 1
        })
      });
    };

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction
    });

    // Initialize OpenLayers Map centered on Indonesia
    const map = new Map({
      target: mapRef.current,
      layers: [vectorLayer],
      view: new View({
        center: fromLonLat([118.0, -2.5]),
        zoom: 5,
        maxZoom: 12,
        minZoom: 4
      }),
      controls: [new ScaleLine(), new Zoom()]
    });

    mapInstanceRef.current = map;

    // Add click/hover interaction
    let hoverFeature = null;
    
    map.on('pointermove', (evt) => {
      if (evt.dragging) {
        return;
      }
      
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (f) => f);
      
      if (feature !== hoverFeature) {
        if (hoverFeature) {
          hoverFeature.setStyle(undefined);
        }
        
        if (feature) {
          const provinceName = feature.get('name');
          const salesData = salesDataMap[provinceName];
          
          if (salesData) {
            feature.setStyle(new Style({
              fill: new Fill({
                color: getColor(salesData)
              }),
              stroke: new Stroke({
                color: '#000000',
                width: 3
              })
            }));
            
            setSelectedRegion({
              name: salesData.original_name,
              quantity: salesData.quantity_sold,
              sales: salesData.total_sales,
              cost: salesData.total_cost,
              transport_cost: salesData.transport_cost,
              ratio: salesData.cost_vs_sales_ratio
            });
          }
        } else {
          setSelectedRegion(null);
        }
        
        hoverFeature = feature;
      }
      
      map.getTargetElement().style.cursor = feature ? 'pointer' : '';
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
        mapInstanceRef.current = null;
      }
    };

  }, [salesByRegion, selectedMetric]);

  if (!salesByRegion || salesByRegion.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <p>No sales data available to display on map.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ fontWeight: 'bold', color: '#333' }}>Display Metric:</label>
        <select 
          value={selectedMetric} 
          onChange={(e) => setSelectedMetric(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '2px solid #0288d1',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: 'white'
          }}
        >
          <option value="cost_vs_sales_ratio">Cost vs Sales Ratio (%)</option>
          <option value="transport_cost">Transport Cost ($)</option>
        </select>
      </div>

      {/* Map and Region Info Side by Side */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px'}}>
        <div 
          ref={mapRef} 
          style={{ 
            flex: '1',
            height: height,
            borderRadius: '8px',
            border: '2px solid #0288d1',
            background: 'linear-gradient(180deg, #4A90E2 0%, #2E5C8A 100%)',
            overflow: 'hidden',
            minWidth: '0'
          }}
        />
        
        {/* Selected Region Info Panel */}
        <div style={{
          width: '300px',
          flexShrink: 0
        }}>
          {selectedRegion ? (
            <div style={{
              padding: '20px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              border: '2px solid #0288d1',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#0288d1', fontSize: '20px' }}>{selectedRegion.name}</h3>
              
              {selectedMetric === 'cost_vs_sales_ratio' && (
                <>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #0288d1' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Cost vs Sales Ratio</p>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0288d1' }}>
                      {selectedRegion.ratio ? selectedRegion.ratio.toFixed(2) : '0.00'}%
                    </p>
                  </div>
                  <div style={{ padding: '10px 0', fontSize: '12px', color: '#666' }}>
                    <p style={{ margin: '5px 0' }}>Transport Cost: Rp. {selectedRegion.transport_cost ? selectedRegion.transport_cost.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}</p>
                  </div>
                </>
              )}

              {selectedMetric === 'transport_cost' && (
                <div style={{ padding: '10px 0' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Transport Cost</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ff7c7c' }}>
                    ${selectedRegion.transport_cost ? selectedRegion.transport_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '2px solid #dee2e6',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
                Hover over a region on the map to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndonesiaSalesMap;
