const config = {
    name: {
        label: "Name",
        type: "text",
        required: true,
    },
    email: {
        label: "Email",
        type: "email",
        required: true,
        validationRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
        label: "Password",
        type: "password",
        required: true,
        minLength: 8,
    },
    phone: {
        label: "Phone",
        type: "tel",
        required: false,
    },
    message: {
        label: "Message",
        type: "textarea",
        required: true,
    },
    department: {
        label: "Department",
        type: "select",
        required: true,
        options: ["Sales", "Marketing", "Support", "Other"],
    },
    subscribe: {
        label: "Subscribe to our newsletter",
        type: "checkbox",
        required: false,
    },
    interests: {
        label: "Interests",
        type: "checkbox",
        required: false,
        options: ["Technology", "Design", "Business", "Lifestyle"],
    },
}

export const bulkScrapeFormConfig = {
    delay: {
        label: "Delay (sec)",
        type: "number",
        defaultValue: 15,
        required: true
    },
    links: {
        label: "Links",
        type: "textarea",
        required: true,
        defaultValue: "",
    },
}

export const singleScrapeFormConfig = {
    delay: {
        label: "Delay (sec)",
        type: "number",
        defaultValue: 15,
        required: true
    },
    link: {
        label: "Link",
        type: "text",
        required: true,
    },
}