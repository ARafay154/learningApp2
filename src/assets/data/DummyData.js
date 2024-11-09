import { SCREEN } from "../../enums/AppEnums";
import { En } from "../../locales/En";
import { IMAGES } from "../images";




export const HOMECARDs = [
    { icon: 'social-joomla', family: "Foundation", text: En.aboutUs, route: SCREEN.ABOUTUS },
    { icon: 'web', family: "MaterialCommunityIcons", text: En.onlineCourses, route: SCREEN.ONLINE_COURSES },
    { icon: 'web-off', family: "MaterialCommunityIcons", text: En.offlineCourses, route: SCREEN.OFFLINE_COURSES },
    { icon: 'work-outline', family: "MaterialIcons", text: En.careers, route: SCREEN.CAREERS },
    { icon: 'bars-progress', family: "FontAwesome6", text: En.progress, route: SCREEN.PROGRESS },
    { icon: 'chatbubble-ellipses-outline', family: "Ionicons", text: En.chats, route: SCREEN.INBOX },
    { icon: 'settings', family: "Feather", text: En.settings, route: SCREEN.SETTINGS },
]

export const SETTING_CARDS = [
    { text: En.editProfile, route: SCREEN.EDIT_PROFILE },
    { text: En.contactUs, route: SCREEN.CONTACTUS },
]


export const DRAWER_NAVIGATION_DATA = [
    { iconName: "home", family: "FontAwesome", route: SCREEN.HOME , title:"Home"},
    { iconName: "book", family: "FontAwesome", route: SCREEN.ABOUTUS,title:"About Us" },
    { iconName: "book", family: "FontAwesome", route: SCREEN.ONLINE_COURSES,title:"Paid Courses" },
    { iconName: "book-open", family: "Feather", route: SCREEN.OFFLINE_COURSES ,title:"Free Courses"},
    { iconName: "briefcase", family: "FontAwesome", route: SCREEN.CAREERS ,title:"Careers"},
    { iconName: "line-chart", family: "FontAwesome", route: SCREEN.PROGRESS ,title:"Progress"},
    { iconName: "envelope", family: "FontAwesome", route: SCREEN.INBOX ,title:"Chats"},
    { iconName: "cog", family: "FontAwesome", route: SCREEN.SETTINGS ,title:"Settings"},
];


export const SLIDER_IMAGES = [
    {image:IMAGES.Slider2},
    {image:IMAGES.Slider3},
    {image:IMAGES.Slider4},
]