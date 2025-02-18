export function timeStringToDate(timeString) {
  // Split the time string into components
  const timeParts = timeString.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0; // Default to 0 if seconds are missing

  // Create a Date object for today
  const today = new Date();

  // Set the time components
  today.setHours(hours);
  today.setMinutes(minutes);
  today.setSeconds(seconds);
  today.setMilliseconds(0); // Reset milliseconds to 0

  return today;
}
