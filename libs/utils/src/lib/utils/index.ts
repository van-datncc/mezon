import { format, startOfDay, subDays, isSameDay, differenceInSeconds } from 'date-fns';

export const convertTimeString = (dateString: string) =>  {
    const codeTime = new Date(dateString);
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(new Date(), 1));
    if (isSameDay(codeTime, today)) {
        // Date is today
        const formattedTime = format(codeTime, 'HH:mm');
        return `Today at ${formattedTime}`;
    } else if (isSameDay(codeTime, yesterday)) {
        // Date is yesterday
        const formattedTime = format(codeTime, 'HH:mm');
        return `Yesterday at ${formattedTime}`;
    } else {
        // Date is neither today nor yesterday
        const formattedDate = format(codeTime, 'dd/MM/yyyy, HH:mm');
        return formattedDate;
    }
}

export const convertTimeHour = (dateString:string) =>  {
    const codeTime = new Date(dateString);
    const formattedTime = format(codeTime, 'HH:mm');
    return formattedTime;
}

export const convertDateString = (dateString:string) =>  {
    const codeTime = new Date(dateString);
    const formattedDate = format(codeTime, 'eee, dd MMMM yyyy');
    return formattedDate;
}

export const getTimeDifferenceInSeconds = (startTimeString: string, endTimeString:string) => {
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);
    const timeDifferenceInSeconds = differenceInSeconds(endTime, startTime);
    return timeDifferenceInSeconds;
}

export const checkSameDay = (startTimeString: string, endTimeString:string) => {
    if(!startTimeString) return false
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);
    const sameDay = isSameDay(startTime, endTime);
    return sameDay;
}