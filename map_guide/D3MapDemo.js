import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { indonesiaRegionsGeoJSON } from '../data/indonesiaRegions';

const D3MapDemo = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    // Generate random demo data for each region
    const demoData = indonesiaRegionsGeoJSON.features.map(feature => ({
      name: feature.properties.name,
      value: Math.random() * 10000 + 1000, // Random value between 1000-11000
      quantity: Math.floor(Math.random() * 500) + 100 // Random quantity 100-600
    }));

    console.log('Demo data:', demoData);

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set up dimensions
    const width = 900;
    const height = 600;
    const padding = 50;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#e8f5f9')
      .style('border', '2px solid #0288d1')
      .style('border-radius', '10px');

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Create a lookup map for demo data
    const dataMap = {};
    demoData.forEach(item => {
      dataMap[item.name] = item;
    });

    // Calculate min and max for color scale
    const values = demoData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    console.log('Value range:', minValue, 'to', maxValue);

    // Create color scale - Yellow to Red
    const colorScale = d3.scaleSequential()
      .domain([minValue, maxValue])
      .interpolator(d3.interpolateYlOrRd);
    
    // Create projection for Indonesia
    const projection = d3.geoMercator()
      .fitSize([width - padding * 2, height - padding * 2], indonesiaRegionsGeoJSON);

    // Create path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Create a group for the map
    const mapGroup = svg.append('g')
      .attr('transform', `translate(${padding}, ${padding})`);

    // Draw the map regions
    mapGroup.selectAll('path')
      .data(indonesiaRegionsGeoJSON.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', d => {
        const regionName = d.properties.name;
        const regionData = dataMap[regionName];
        const color = regionData ? colorScale(regionData.value) : '#cccccc';
        return color;
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .style('opacity', 0.85)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const regionName = d.properties.name;
        const regionData = dataMap[regionName];
        
        d3.select(this)
          .style('opacity', 1)
          .attr('stroke', '#000')
          .attr('stroke-width', 2.5);

        if (regionData) {
          tooltip
            .style('display', 'block')
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 30) + 'px')
            .html(`
              <div style="min-width: 180px;">
                <strong style="font-size: 14px; color: #0288d1;">${regionName}</strong><br/>
                <span style="color: #666;">Quantity: <strong>${regionData.quantity.toLocaleString()}</strong> units</span><br/>
                <span style="color: #666;">Sales: <strong>$${regionData.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
              </div>
            `);
        }
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .style('opacity', 0.85)
          .attr('stroke', '#333')
          .attr('stroke-width', 1);

        tooltip.style('display', 'none');
      })
      .on('click', function(event, d) {
        const regionName = d.properties.name;
        console.log('Clicked region:', regionName);
      });

    // Add region labels
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
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 0 3px white, 0 0 3px white')
      .text(d => d.properties.name);

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', '#0288d1')
      .text('Indonesia Sales Distribution Map (Demo Data)');

    // Add color legend
    const legendWidth = 250;
    const legendHeight = 20;
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width - legendWidth - 30}, ${height - 50})`);

    // Create gradient for legend
    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient');

    const stops = d3.range(0, 1.1, 0.1);
    linearGradient.selectAll('stop')
      .data(stops)
      .enter()
      .append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(minValue + d * (maxValue - minValue)));

    // Legend background
    legendGroup.insert('rect', ':first-child')
      .attr('x', -10)
      .attr('y', -28)
      .attr('width', legendWidth + 20)
      .attr('height', legendHeight + 55)
      .style('fill', 'white')
      .style('stroke', '#0288d1')
      .style('stroke-width', 2)
      .attr('rx', 5);

    // Legend title
    legendGroup.append('text')
      .attr('x', 0)
      .attr('y', -8)
      .text('Sales Value Range')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .style('fill', '#333');

    // Legend gradient rectangle
    legendGroup.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')
      .style('stroke', '#333')
      .style('stroke-width', 1);

    // Legend labels
    legendGroup.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .text(`$${(minValue / 1000).toFixed(1)}k`)
      .style('font-size', '11px')
      .style('fill', '#666');

    legendGroup.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .attr('text-anchor', 'end')
      .text(`$${(maxValue / 1000).toFixed(1)}k`)
      .style('font-size', '11px')
      .style('fill', '#666');

    console.log('Map rendered successfully with', indonesiaRegionsGeoJSON.features.length, 'regions');

  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <svg 
        ref={svgRef}
        style={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
      <div 
        ref={tooltipRef}
        style={{
          position: 'absolute',
          display: 'none',
          backgroundColor: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          border: '2px solid #0288d1',
          pointerEvents: 'none',
          zIndex: 1000,
          fontSize: '13px'
        }}
      />
    </div>
  );
};

export default D3MapDemo;
