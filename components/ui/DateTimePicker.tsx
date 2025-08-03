import { colors } from "@/constants/Colors";
import { Calendar, Clock, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "./Button";

interface DateTimePickerProps {
  label: string;
  value: string | null;
  onChange: (dateTime: string) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  minDate,
  maxDate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    value
      ? new Date(value).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "08:00"
  );

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDisplayTime = (time: Date): string => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirm = () => {
    // Parse the time string
    const [hours, minutes] = selectedTime.split(":").map(Number);

    // Create a new date with the selected date and time
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);

    onChange(dateTime.toISOString());
    setModalVisible(false);
  };

  // Generate time slots every 15 minutes
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate dates for the next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, error ? styles.inputError : null]}
        onPress={() => setModalVisible(true)}
      >
        <Calendar size={20} color={colors.primary} style={styles.icon} />

        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>

          <Text style={value ? styles.value : styles.placeholder}>
            {value
              ? (() => {
                  const dateObj = new Date(value);
                  const displayDate = formatDisplayDate(dateObj);
                  const displayTime = formatDisplayTime(dateObj);
                  return `${displayDate} at ${displayTime}`;
                })()
              : "Select date and time"}
          </Text>
        </View>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date & Time</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateSection}>
                <View style={styles.sectionHeader}>
                  <Calendar size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Date</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.datesScrollView}
                >
                  {dates.map((date, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dateItem,
                        isDateSelected(date) && styles.selectedDateItem,
                      ]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text
                        style={[
                          styles.dateDay,
                          isDateSelected(date) && styles.selectedDateText,
                        ]}
                      >
                        {date.toLocaleDateString(undefined, {
                          weekday: "short",
                        })}
                      </Text>
                      <Text
                        style={[
                          styles.dateNumber,
                          isDateSelected(date) && styles.selectedDateText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                      <Text
                        style={[
                          styles.dateMonth,
                          isDateSelected(date) && styles.selectedDateText,
                        ]}
                      >
                        {date.toLocaleDateString(undefined, { month: "short" })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.timeSection}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Time</Text>
                </View>

                <ScrollView
                  style={styles.timesScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.timeGrid}>
                    {timeSlots.map((time, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeItem,
                          selectedTime === time && styles.selectedTimeItem,
                        ]}
                        onPress={() => setSelectedTime(time)}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            selectedTime === time && styles.selectedTimeText,
                          ]}
                        >
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Confirm" onPress={handleConfirm} fullWidth />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    padding: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.inactive,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    fontSize: 16,
    color: colors.inactive,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateSection: {
    marginBottom: 20,
  },
  timeSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  datesScrollView: {
    flexDirection: "row",
  },
  dateItem: {
    width: 70,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    padding: 8,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  dateDay: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 14,
    color: colors.text,
  },
  selectedDateText: {
    color: colors.white,
  },
  timesScrollView: {
    maxHeight: 200,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeItem: {
    width: "30%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  selectedTimeItem: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedTimeText: {
    color: colors.white,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
