import { Platform } from 'react-native'
import { COLOR, FONT, hp, wp } from '../enums/StyleGuide'
import Toast from 'react-native-toast-message';


export const isIOS = () => {
    return Platform.OS == 'ios'
}

export const showFlash = (message, type = 'success', message2, icon = "none", floating = false) => {
  Toast.show({
    type: type, // 'success', 'error', or 'info' are predefined
    text1: message,
    position: floating ? 'bottom' : 'top',
    visibilityTime: 4000,
    autoHide: true,
    topOffset: hp(5),
    bottomOffset: hp(5),
    style: {
      backgroundColor: COLOR.white,
      borderRadius: wp(1),
      minHeight: hp(4),
      marginHorizontal: 20,
    },
    textStyle: {
      fontFamily: FONT.regular,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '700',
      paddingVertical: 20,
      color: COLOR.black
    },
  });
};



export const textLimit = (text, limit) => {
  if (text?.length >= limit) {
      return `${text?.slice(0, limit)}...`
  } else {
      return text
  }
}


export const isStrongPassword = (text) => {
  // password should be 6 digits and have one capital, one special char and a number
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>.]{6,}$/
  return strongPasswordRegex?.test(text)
}

export const isEmailValid = (text) => {
  const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  return reg?.test(text)
}


export function calculateTimeDifference(timestamp) {
  if (!timestamp) return '';

  const nanoseconds = timestamp?.nanoseconds;
  const seconds = timestamp?.seconds;

  if (nanoseconds === undefined || seconds === undefined) {
    return 'Just now';
  }
  const timestampInMillis = seconds * 1000 + Math.floor(nanoseconds / 1e6);
  const currentTime = Date.now();
  const timeDifference = currentTime - timestampInMillis;

  if (timeDifference <= 0) {
    return 'Just now';
  }
  const totalSeconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  }
  return `${totalSeconds} sec${totalSeconds > 1 ? 's' : ''} ago`;
}


export function formatDate(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();
  const timeDifference = now - date; // Time difference in milliseconds

  const totalSeconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (totalSeconds < 60) {
    return `${totalSeconds} sec${totalSeconds !== 1 ? 's' : ''} ago`;
  } else if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}


export function calculateTime(timestamp) {
  const nanoseconds = timestamp?.nanoseconds
  const seconds = timestamp?.seconds
  const milliseconds = Math.floor(nanoseconds / 1e6)
  const date = new Date(0)
  date.setSeconds(seconds)
  date.setMilliseconds(milliseconds)
  const timeString = date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

  return timeString === 'Invalid Date' ? null : timeString
}

export function formatDate2(timestamp) {
  const nanoseconds = timestamp?.nanoseconds;
  const seconds = timestamp?.seconds;
  const milliseconds = Math.floor(nanoseconds / 1e6);
  const date = new Date(0);
  date.setSeconds(seconds);
  date.setMilliseconds(milliseconds);

  const dateString = date?.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return dateString === 'Invalid Date' ? null : dateString;
}
