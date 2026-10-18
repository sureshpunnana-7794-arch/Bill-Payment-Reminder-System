// Utility to generate and download an iCalendar (.ics) reminder file

export const downloadBillCalendarReminder = (bill) => {
  const dueDate = new Date(bill.dueDate);
  
  // Set reminder start to 9:00 AM on the due date
  const start = new Date(dueDate);
  start.setHours(9, 0, 0, 0);
  
  // 1 hour event
  const end = new Date(dueDate);
  end.setHours(10, 0, 0, 0);

  const formatDateToICS = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const title = `Bill Due: ${bill.providerName} (₹${bill.amount})`;
  const description = `Reminder to pay your ${bill.category} bill for ${bill.providerName}. Account/Consumer ID: ${bill.consumerId}. Amount: ₹${bill.amount}. Linked to Mobile: ${bill.linkedPhone}.`;
  const location = 'PayPulse Online Portal';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PayPulse//Bill Payment Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:paypulse-${bill.id}-${Date.now()}@paypulse.app`,
    `DTSTAMP:${formatDateToICS(new Date())}`,
    `DTSTART:${formatDateToICS(start)}`,
    `DTEND:${formatDateToICS(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${title} due tomorrow!`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:URGENT: ${title} due today!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${bill.providerName.replace(/\s+/g, '_')}_Due_Reminder.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
