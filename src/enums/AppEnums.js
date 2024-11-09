export const KEYBOARD_TYPE = {
  DEFAULT: 'default',
  DECIMAL_PAD: 'decimal-pad',
  NUMERIC: 'numeric',
  EMAIL: 'email-address',
  PHONE_PAD: 'phone-pad',
  URL: 'url',
}

export const SCREEN = {
  LOGIN: "LoginScreen",
  REGISTER: "RegisterScreen",
  SPLASH: "SplashScreen",
  HOME: "HomeScreen",
  CAREERS: "CareersScreen",
  ABOUTUS: "AboutUs",
  CHAT: "ChatScreen",
  INBOX: "InboxScreen",
  ONLINE_COURSES: "OnlineCoursesScreen",
  OFFLINE_COURSES: "OfflineCoursesScreen",
  SETTINGS: "SettingsScreen",
  CONTACTUS: "ContactUsScreen",
  EDIT_PROFILE: "EditProfileScreen",
  COURSE_UPLOAD: "CourseuploadScreen",
  SPECIFIC_CAT_COURSE: "SpecificCategoryCourseScreen",
  NEW_COURSE:"NewCourseScreen",
  VIDEO_SCREEN:"VideoScreen",
  ADD_QUIZ:"AddQuizScreen",
  QUIZ_ATTEMPT:"QuizAttemptScreen",
  POST_NEWJOB:"PostNewJob",
  JOB_DETAILS:"JobDetailsScreen",
  EDIT_JOB:"EditNewJob",
  PROGRESS:"ProgressScreen",
  STUDENTS_PROGRESS:"StudentsProgressScreen",
  SINGLE_STUDENT_PROGRESS:"SingleStudentProgressScreen",
  PAYMENT_SCREEN:'PaymentScreen'
}

export const FIREBASE_COLLECTIONS = {
  USERS: "users",
  ONLINE_LECTURES:"online_lectures",
  COURSES:"courses",
  QUIZES:"quizes",
  CHATS:"chats",
  MESSAGES:"messages",
  JOBS:"jobs",
  TRANSACTIONS_HISTORY:"transaction_history",
  JOB_APPLIED:"job_applied"
}

export const ACC_TYPE = {
  TEACHER:"Teacher",
  STUDENT:"Student"
}

export const STORAGE_FOLDERS = {
  PROFILE_IMAGES:"profileImages",
  RESUMES:'resumes'
}


export const STRIPE_PUBLISHKEY="pk_test_51QIa6CI8FUx9qxcaXssQ9CrbYdy3Pbn9TqFr53yCW62yJnfi6mfPUcXpnpUAzeLmNj3SkGML2iQjYIfrNplsw7Pn00PnziuHi5"



export const PAYMENT_UTILS = {
  NEW_CUSTOMER:"/create-customer",
  NEW_CARD:"/add-newCard",
  GET_CARDS:"/paymentMethods_get",
  CREATE_CHARGE:"/create-charges"
}