const emojis = [
    {
        data: "🍗",
        category: "Foods",
        name: "Turkey Leg"
    },
    {
        data: "🍔",
        category: "Foods",
        name: "Hamburger"
    },
    {
        data: "🌰",
        category: "Foods",
        name: "Chestnut"
    },
    {
        data: "🥜",
        category: "Foods",
        name: "Groundnuts"
    },
    {
        data: "🍞",
        category: "Foods",
        name: "Bread"
    },
    {
        data: "🧀",
        category: "Foods",
        name: "Cheese Wedge"
    },
    {
        data: "🥚",
        category: "Foods",
        name: "Egg"
    },
    {
        data: "🍳",
        category: "Foods",
        name: "Omelette"
    },
    {
        data: "🥞",
        category: "Foods",
        name: "Pancakes"
    },
    {
        data: "🍕",
        category: "Foods",
        name: "Pizza"
    },
    {
        data: "☕",
        category: "Foods",
        name: "Coffee"
    },
    {
        data: "🌮",
        category: "Foods",
        name: "Taco"
    },
    {
        data: "🍚",
        category: "Foods",
        name: "Rice"
    },
    {
        data: "🍛",
        category: "Foods",
        name: "Curry Rice"
    },
    {
        data: "🍨",
        category: "Foods",
        name: "Ice Cream"
    },
    {
        data: "🍧",
        category: "Foods",
        name: "Shaved Ice"
    },
    {
        data: "🍦",
        category: "Foods",
        name: "Soft Ice Cream"
    },
    {
        data: "🍰",
        category: "Foods",
        name: "Shortcake"
    },
    {
        data: "🎂",
        category: "Foods",
        name: "Birthday Cake"
    },
    {
        data: "🍮",
        category: "Foods",
        name: "Custard"
    },
    {
        data: "🍭",
        category: "Foods",
        name: "Lollipop"
    },
    {
        data: "🍪",
        category: "Foods",
        name: "Cookie"
    },
    {
        data: "🍩",
        category: "Foods",
        name: "Doughnut"
    },
    {
        data: "🍿",
        category: "Foods",
        name: "Popcorn"
    },
    {
        data: "🍫",
        category: "Foods",
        name: "Chocolate Bar"
    },
    {
        data: "🥛", 
        category: "Foods",
        name: "Glass of Milk"
    },
    {
        data: "🍺", 
        category: "Foods",
        name: "Beer"
    },
    {
        data: "🍷", 
        category: "Foods",
        name: "Wine"
    },
    {
        data: "🍾", 
        category: "Foods",
        name: "Champagne"
    },
    {
        data: "🍸",
        category: "Foods",
        name: "Cocktail",
    },
    {
        data: "🍝",
        category: "Foods",
        name: "Spaghetti",
    },
    {
        data: "🍉",
        category: "Foods",
        name: " Watermelon",
    },
    {
        data: "🍍",
        category: "Foods",
        name: "Pineapple",
    },
    {
        data: "🍇",
        category: "Foods",
        name: "Grapes",
    },
    {
        data: "🍓",
        category: "Foods",
        name: "Strawberry",
    },
    {
        data: "🍏",
        category: "Foods",
        name: "Apple",
    },
    {
        data: "🥕",
        category: "Foods",
        name: "Carrot",
    },
    {
        data: "🌽",
        category: "Foods",
        name: "Corn",
    },
    {
        data: "🍌",
        category: "Foods",
        name: "Banana",
    },
    {
        data: "🐰",
        category: "Nature",
        name: "Rabbit",
    },
    {
        data: "🐱",
        category: "Nature",
        name: "Cat",
    },
    {
        data: "🐰",
        category: "Nature",
        name: "Rabbit",
    },
    {
        data: "🐼",
        category: "Nature",
        name: "Panda",
    },
    {
        data: "🐔",
        category: "Nature",
        name: "Chicken",
    },
    {
        data: "🐌",
        category: "Nature",
        name: "Snail",
    },
    {
        data: "🎄",
        category: "Nature",
        name: "Christmas Tree",
    },
    {
        data: "🐦",
        category: "Nature",
        name: "Parrot",
    },
    {
        data: "🎮",
        category: "Objects",
        name: "Video Game",
    },
    {
        data: "🎸",
        category: "Objects",
        name: "Guitar",
    },
    {
        data: "🏀",
        category: "Objects",
        name: "Basketball",
    },
    {
        data: "⌚️",
        category: "Objects",
        name: "Watch"
    },
    {
        data: "💻",
        category: "Objects",
        name: "Laptop",
    },
    {
        data: "📸",
        category: "Objects",
        name: "Camera",
    },
    {
        data: "📻",
        category: "Objects",
        name: "Radio",
    },
    {
        data: "🏍",
        category: "Objects",
        name: "Motorcycle",
    },
    {
        data: "🛵",
        category: "Objects",
        name: "Scooter",
    },
    {
        data: "🚗",
        category: "Objects",
        name: "Car",
    },
    {
        data: "🚐",
        category: "Objects",
        name: "Mini Bus",
    },
    {
        data: "👖",
        category: "Objects",
        name: "Jean",
    },
    {
        data: "👕",
        category: "Objects",
        name: "T-Shirt",
    },
    {
        data: "👔",
        category: "Objects",
        name: "Neck Tie",
    },
    {
        data: "👙",
        category: "Objects",
        name: "Bikini",
    },
    {
        data: "👗",
        category: "Objects",
        name: "Dress",
    },
    {
        data: "👠",
        category: "Objects",
        name: "High-Heeled Shoe",
    },
    {
        data: "🎩",
        category: "Objects",
        name: "Top Hat",
    },
    {
        data: "👒",
        category: "Objects",
        name: "Woman’s Hat",
    },
    {
        data: "👢",
        category: "Objects",
        name: "Woman’s Boot",
    },
    {
        data: "👞",
        category: "Objects",
        name: "Men's Shoe",
    },
    {
        data: "🕶",
        category: "Objects",
        name: "Sunglasses",
    },
    {
        data: "👓",
        category: "Objects",
        name: "Glasses",
    },
    {
        data: "📚",
        category: "Objects",
        name: "Books",
    }
]