import { mockBookings } from '@/mocks/data';
import { Booking, Location, Route } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BookingState {
  bookings: Booking[];
  activeBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  selectedRoute: Route | null;
  selectedPickup: Location | null;
  selectedDropoff: Location | null;
  selectedDate: string | null;
  passengerCount: number;
  isGroupBooking: boolean;
  
  // Actions
  fetchBookings: () => Promise<void>;
  createBooking: (booking: Partial<Booking>) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  setActiveBooking: (booking: Booking | null) => void;
  setSelectedRoute: (route: Route | null) => void;
  setSelectedPickup: (location: Location | null) => void;
  setSelectedDropoff: (location: Location | null) => void;
  setSelectedDate: (date: string | null) => void;
  setPassengerCount: (count: number) => void;
  setIsGroupBooking: (isGroup: boolean) => void;
  resetBookingForm: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      activeBooking: null,
      isLoading: false,
      error: null,
      selectedRoute: null,
      selectedPickup: null,
      selectedDropoff: null,
      selectedDate: null,
      passengerCount: 1,
      isGroupBooking: false,
      
      fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ bookings: mockBookings, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch bookings', isLoading: false });
        }
      },
      
      createBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            userId: '1', // Current user ID
            routeId: get().selectedRoute?.id || '',
            busId: '1', // Assigned bus ID
            status: 'pending',
            pickupLocation: get().selectedPickup!,
            dropoffLocation: get().selectedDropoff!,
            pickupTime: get().selectedDate || new Date().toISOString(),
            fare: get().selectedRoute?.fare.current || 0,
            paymentStatus: 'pending',
            paymentMethod: 'mobile_money',
            passengerCount: get().passengerCount,
            createdAt: new Date().toISOString(),
            isGroupBooking: get().isGroupBooking,
            ...bookingData,
          };
          
          set((state) => ({
            bookings: [...state.bookings, newBooking],
            activeBooking: newBooking,
            isLoading: false,
          }));
          
          return newBooking;
        } catch (error) {
          set({ error: 'Failed to create booking', isLoading: false });
          throw error;
        }
      },
      
      cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' } 
                : booking
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to cancel booking', isLoading: false });
        }
      },
      
      setActiveBooking: (booking) => {
        set({ activeBooking: booking });
      },
      
      setSelectedRoute: (route) => {
        set({ selectedRoute: route });
      },
      
      setSelectedPickup: (location) => {
        set({ selectedPickup: location });
      },
      
      setSelectedDropoff: (location) => {
        set({ selectedDropoff: location });
      },
      
      setSelectedDate: (date) => {
        set({ selectedDate: date });
      },
      
      setPassengerCount: (count) => {
        set({ passengerCount: count });
      },
      
      setIsGroupBooking: (isGroup) => {
        set({ isGroupBooking: isGroup });
      },
      
      resetBookingForm: () => {
        set({
          selectedRoute: null,
          selectedPickup: null,
          selectedDropoff: null,
          selectedDate: null,
          passengerCount: 1,
          isGroupBooking: false,
        });
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookings: state.bookings,
        // Don't persist loading states or form selections
      }),
    }
  )
);