// utils/dateFormatter.js
import { format } from 'date-fns';

export function formatDate(date, formatString = 'ccc, d MMM yyyy') {
    return format(new Date(date), formatString);
}

export function formatDateForComparison(date) {
    return format(new Date(date), 'yyyy-MM-dd');
}
