export const formatDate = (dateObj: Date) => {
  // Prisma returns dates as strings, so we need to convert them to Date objects
  // Even though the type is Date, it's actually a string
  const date = new Date(dateObj);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} - ${hours}:${minutes} ${ampm}`;
};
