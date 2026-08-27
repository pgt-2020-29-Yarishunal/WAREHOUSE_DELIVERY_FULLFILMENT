import { useState, useEffect, useMemo } from 'react';
import { dashboardApi } from '../api/dashboardApi.js';

export const useDashboard = (searchKeyword = '') => {
  const [deliveries, setDeliveries] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [delRes, kpiRes] = await Promise.all([
        dashboardApi.getDeliveries(),
        dashboardApi.getKpiSummary(),
      ]);
      setDeliveries(delRes);
      setKpi(kpiRes);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((item) => {
      const matchesSearch =
        item.sjNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.truckNo.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' || item.status.toUpperCase() === selectedStatus.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [deliveries, searchKeyword, selectedStatus]);

  const addDelivery = (newItem) => {
    const created = {
      ...newItem,
      id: `${Date.now()}`,
    };
    setDeliveries((prev) => [created, ...prev]);
  };

  return {
    deliveries: filteredDeliveries,
    kpi,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    refresh: fetchData,
    addDelivery,
  };
};
