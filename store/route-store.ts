import { mockLocations, mockRoutes } from '@/mocks/data';
import { Location, Route } from '@/types';
import { create } from 'zustand';

interface RouteState {
  routes: Route[];
  popularRoutes: Route[];
  locations: Location[];
  popularLocations: Location[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRoutes: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  searchRoutes: (from: string, to: string) => Promise<Route[]>;
  getRouteById: (id: string) => Route | undefined;
  getLocationById: (id: string) => Location | undefined;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  popularRoutes: [],
  locations: [],
  popularLocations: [],
  isLoading: false,
  error: null,
  
  fetchRoutes: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ 
        routes: mockRoutes,
        popularRoutes: mockRoutes.filter(route => route.popularity > 0.7),
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch routes', isLoading: false });
    }
  },
  
  fetchLocations: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ 
        locations: mockLocations,
        popularLocations: mockLocations.filter(location => location.isPopular),
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch locations', isLoading: false });
    }
  },
  
  searchRoutes: async (from, to) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Filter routes based on search criteria
      const filteredRoutes = mockRoutes.filter(route => {
        const fromMatch = route.startLocation.name.toLowerCase().includes(from.toLowerCase()) ||
                         route.stops.some(stop => stop.name.toLowerCase().includes(from.toLowerCase()));
        
        const toMatch = route.endLocation.name.toLowerCase().includes(to.toLowerCase()) ||
                       route.stops.some(stop => stop.name.toLowerCase().includes(to.toLowerCase()));
        
        return fromMatch && toMatch;
      });
      
      set({ isLoading: false });
      return filteredRoutes;
    } catch (error) {
      set({ error: 'Failed to search routes', isLoading: false });
      return [];
    }
  },
  
  getRouteById: (id) => {
    return get().routes.find(route => route.id === id);
  },
  
  getLocationById: (id) => {
    return get().locations.find(location => location.id === id);
  },
}));