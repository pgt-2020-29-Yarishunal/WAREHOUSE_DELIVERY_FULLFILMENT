import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { indonesiaRegionsGeoJSON } from '../data/indonesiaRegions';

const D3ChoroplethMap = ({ salesByRegion, selectedRegion, setSelectedRegion, selectedWarehouse, warehouses }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!salesByRegion || salesByRegion.length === 0) return;

    console.log('Drawing map with salesByRegion:', salesByRegion);
    console.log('GeoJSON features:', indonesiaRegionsGeoJSON.features.length);

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set up dimensions
    const width = 800;
    const height = 500;
    const padding = 40;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', '#e8f4f8')
      .style('border', '1px solid #ccc')
      .style('border-radius', '8px');

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Create a lookup map for sales data
    const salesDataMap = {};
    salesByRegion.forEach(region => {
      salesDataMap[region.name] = region;
    });

    // Calculate min and max for color scale
    const minSales = d3.min(salesByRegion, d => d.total_sales) || 0;
    const maxSales = d3.max(salesByRegion, d => d.total_sales) || 100;

    console.log('Sales range:', minSales, 'to', maxSales);

    // Create color scale
    const colorScale = d3.scaleSequential()
      .domain([minSales, maxSales])
      .interpolator(d3.interpolateYlOrRd);
    
    // Create projection for Indonesia
    const projection = d3.geoMercator()
      .fitSize([width - padding * 2, height - padding * 2], indonesiaRegionsGeoJSON);

    // Create path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Create a group for the map with transform
    const mapGroup = svg.append('g')
      .attr('transform', `translate(${padding}, ${padding})`);

    // Draw the map
    const paths = mapGroup.selectAll('path')
      .data(indonesiaRegionsGeoJSON.features)
      .enter()
      .append('path')
      .attr('d', d => {
        const path = pathGenerator(d);
        console.log('Drawing path for', d.properties.name, ':', path);
        return path;
      })
      .attr('fill', d => {
        const regionName = d.properties.name;
        const regionData = salesDataMap[regionName];
        const color = regionData ? colorScale(regionData.total_sales) : '#cccccc';
        console.log(`Region ${regionName}: has data=${!!regionData}, color=${color}`);
        return color;
      })
      .attr('stroke', d => {
        const regionName = d.properties.name;
        return selectedRegion?.name === regionName ? '#ff0000' : '#333';
      })
      .attr('stroke-width', d => {
        const regionName = d.properties.name;
        return selectedRegion?.name === regionName ? 3 : 1;
      })
      .style('opacity', d => {
        const regionName = d.properties.name;
        const regionData = salesDataMap[regionName];
        return regionData ? 0.9 : 0.3;
      })
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const regionName = d.properties.name;
        const regionData = salesDataMap[regionName];
        
        if (regionData) {
          d3.select(this)
            .style('opacity', 1)
            .attr('stroke', '#000')
            .attr('stroke-width', 3);

          tooltip
            .style('display', 'block')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px')
            .html(`
              <div style="min-width: 150px;">
                <strong>${regionName}</strong><br/>
                Quantity: ${regionData.quantity_sold.toLocaleString()}<br/>
                Sales: $${parseFloat(regionData.total_sales).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            `);
        }
      })
      .on('mouseout', function(event, d) {
        const regionName = d.properties.name;
        const regionData = salesDataMap[regionName];
        
        if (regionData) {
          d3.select(this)
            .style('opacity', 0.8)
            .attr('stroke', selectedRegion?.name === regionName ? '#ff0000' : '#333')
            .attr('stroke-width', selectedRegion?.name === regionName ? 3 : 1.5);

          tooltip.style('display', 'none');
        }
      })
      .on('click', function(event, d) {
        const regionName = d.properties.name;
        const regionData = salesDataMap[regionName];
        
        if (regionData) {
          setSelectedRegion(regionData);
          
          // Update all paths
          mapGroup.selectAll('path')
            .attr('stroke', pathD => {
              const pathRegionName = pathD.properties.name;
              return pathRegionName === regionName ? '#ff0000' : '#333';
            })
            .attr('stroke-width', pathD => {
              const pathRegionName = pathD.properties.name;
              return pathRegionName === regionName ? 3 : 1.5;
            });
        }
      });

    // Add region labels for debugging
    mapGroup.selectAll('text.region-label')
      .data(indonesiaRegionsGeoJSON.features)
      .enter()
      .append('text')
      .attr('class', 'region-label')
      .attr('transform', d => {
        const centroid = pathGenerator.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#000')
      .attr('pointer-events', 'none')
      .text(d => d.properties.name);

    console.log('Map drawn with', paths.size(), 'paths');

    // Add color legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legend = svg.append('g')
      .attr('transform', `translate(20, ${height - 60})`);

    // Create gradient for legend
    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient');

    // Define gradient stops
    const stops = d3.range(0, 1.1, 0.1);
    linearGradient.selectAll('stop')
      .data(stops)
      .enter()
      .append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(minSales + d * (maxSales - minSales)));

    // Draw legend rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')
      .style('stroke', '#333')
      .style('stroke-width', 1);

    // Add legend background
    legend.insert('rect', ':first-child')
      .attr('x', -10)
      .attr('y', -25)
      .attr('width', legendWidth + 20)
      .attr('height', legendHeight + 50)
      .style('fill', 'white')
      .style('stroke', '#ddd')
      .style('stroke-width', 1)
      .attr('rx', 5);

    // Add legend title
    legend.append('text')
      .attr('x', 0)
      .attr('y', -8)
      .text('Sales Density')
      .style('font-size', '13px')
      .style('font-weight', 'bold');

    // Add legend labels
    legend.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .text(`$${(minSales / 1000).toFixed(0)}k`)
      .style('font-size', '11px')
      .style('fill', '#666');

    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .attr('text-anchor', 'end')
      .text(`$${(maxSales / 1000).toFixed(0)}k`)
      .style('font-size', '11px')
      .style('fill', '#666');

  }, [salesByRegion, selectedRegion, setSelectedRegion]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg 
        ref={svgRef}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: '800px'
        }}
      ></svg>
      <div 
        ref={tooltipRef}
        style={{
          position: 'absolute',
          display: 'none',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          pointerEvents: 'none',
          zIndex: 1000,
          fontSize: '13px'
        }}
      />
    </div>
  );
};

export default D3ChoroplethMap;
