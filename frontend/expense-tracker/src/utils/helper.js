import moment from "moment"

import { BASE_URL } from "./apiPaths";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getProfileImageUrl = (url) => {
    if (!url) return "";
    
    // If it is a blob URL (from file input preview), return it directly
    if (typeof url === "string" && url.startsWith("blob:")) {
        return url;
    }
    
    // If it's a full URL, use the browser's URL constructor to safely parse and reconstruct it
    if (typeof url === "string" && url.includes("http")) {
        try {
            const parsedUrl = new URL(url);
            const pathnameParts = parsedUrl.pathname.split("/");
            const filename = pathnameParts.pop();
            // Decode first to prevent double encoding if the database URL was already partially encoded
            const decodedFilename = decodeURIComponent(filename);
            parsedUrl.pathname = [...pathnameParts, encodeURIComponent(decodedFilename)].join("/");
            return parsedUrl.toString();
        } catch (e) {
            console.error("Invalid URL in getProfileImageUrl:", url);
            return url;
        }
    }
    
    // Otherwise, it's a relative filename/path, so we prepend BASE_URL/uploads
    return `${BASE_URL}/uploads/${encodeURIComponent(url)}`;
};

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ")
    let initials = ""

    for (let i=0;i<Math.min(words.length,2);i++){
        initials += words[i][0]
    }

    return initials.toUpperCase()
}

export const addThousandsSeparator = (num) =>{
    if(num == null || isNaN(num)) return ""

    const [integerPart,fractionalPart] = num.toString().split(".")
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",")
    
    return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger
}

export const prepareExpenseBarChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category:item?.category,
        amount: Number(item?.amount || 0),
    }))

    return chartData
}

export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date))

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format("Do MMM"),
        amount: Number(item?.amount || 0),
        source: item?.source,
    }))

    return chartData

}

export const prepareExpenseLineChartData = (data =[]) => {
    const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date))

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format("Do MMM"),
        amount: Number(item?.amount || 0),
        category: item?.category,
    }))

    return chartData
}