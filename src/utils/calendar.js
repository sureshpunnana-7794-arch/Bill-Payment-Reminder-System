// Calendar reminder utility for generating and downloading .ics files

export const downloadBillCalendarReminder = (bill) => {
  if (!bill) return;

  const title = `Pay Bill: ${bill.providerName}`;
  const description = `Reminder to pay ${bill.providerName} bill of ₹${bill.amount}. Consumer/Account ID: ${bill.consumerId || 'N/A'}`;
  
  // Format due date for iCalendar (YYYYMMDD)
  const dueDateStr = bill.dueDate ? bill.dueDate.replace(/-/g, '') : new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PayPulse//Bill Payment Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:bill-${bill.id || Date.now()}@paypulse.app`,
    `DTSTAMP:${nowStr}`,
    `DTSTART;VALUE=DATE:${dueDateStr}`,
    `DTEND;VALUE=DATE:${dueDateStr}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'DESCRIPTION:Reminder: Bill Due Tomorrow',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${(bill.providerName || 'Bill').replace(/\s+/g, '_')}_reminder.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
