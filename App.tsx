import React, { useState, useRef, useEffect } from 'react';
import { GenerationMode } from './types';
import { generateProductImage } from './services/geminiService';
import { RefreshIcon, SparklesIcon, ChevronDownIcon, WhatsAppIcon, MailIcon, UserIcon, WandIcon, SceneIcon, LayoutIcon, SwapIcon, CubeIcon, StorefrontIcon, BusinessCardIcon } from './components/Icons';
import ImageUploader from './components/ImageUploader';
import ImageComparator from './components/ImageComparator';
import HistoryTray from './components/HistoryTray';
import WelcomeModal from './components/WelcomeModal';
import ProfileModal from './components/ProfileModal';
import CustomDropdown from './components/CustomDropdown';
import ImageSelection from './components/ImageSelection';
import Marquee from './components/Marquee';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.Mockup);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [swapImage, setSwapImage] = useState<File | null>(null);
  
  const [selectedMockup, setSelectedMockup] = useState<string>('product held by a hand with a background of lush greenery and a pink, bubbly aesthetic');
  
  const [generatedImageUrls, setGeneratedImageUrls] = useState<[string, string] | null>(null);
  const [currentGeneratedImageUrl, setCurrentGeneratedImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const threeDScenes = {
    "استوديو عصري": "on a podium in a minimalist 3D studio with soft, diffused lighting and abstract geometric shapes in the background, photorealistic render.",
    "حديقة": "on a smooth, dark stone in a serene 3D rendered zen garden, with realistic water ripples, sand patterns, and a single bonsai tree.",
    "مشهد مستقبلي نيون": "floating in a futuristic 3D environment with glowing neon lines on the floor and holographic data displays in the background.",
    "غرفة معيشة فاخرة": "on a wooden coffee table in a cozy, luxurious 3D rendered living room with warm morning light streaming through a large window.",
    "منصة وسط الطبيعة": "on a marble pedestal surrounded by lush, detailed 3D tropical leaves and flowers, with dramatic god rays shining down.",
    "انعكاسات مائية": "resting on a surface of crystal clear water, creating realistic ripples and caustic light reflections on a simple background, 3D render.",
    "تجريد معدني سائل": "floating in a zero-gravity 3D space, with splashes of liquid chrome or gold frozen in time around the product.",
    "كهف كريستالي": "placed on a glowing crystal formation inside a beautiful, detailed 3D cavern with shimmering walls.",
    "منصة سحابية": "on a soft, fluffy cloud pedestal high in the sky, with a dreamy, pastel-colored sunset in the background, 3D render."
  };
  
  const facadeMockups = {
    "واجهة شارع (نهار)": "A photorealistic, eye-level shot of a modern storefront on a bustling, authentic Egyptian street during bright daylight. The store is situated between other realistic shops. The facade features a large central roll-up garage door. The provided image contains the brand identity/logo. Realistically mock up this branding onto three sign areas: a large horizontal sign above the garage door, and two vertical signs on the left and right sides of the facade. The branding should be adapted tastefully to each sign's dimension. The scene must include realistic daytime lighting, subtle reflections, and natural shadows, making the atmosphere feel authentic and vibrant.",
    "واجهة شارع (ليل)": "A photorealistic, eye-level shot of a modern storefront on a lively, authentic Egyptian street at night. The store is between other illuminated shops. The facade features a large central roll-up garage door. The provided image contains the brand identity/logo. Realistically mock up this branding onto three brightly illuminated signs: a large horizontal lightbox sign above the garage door (lit from below by spotlights), and two glowing vertical signs on the sides. The branding should be adapted tastefully to each sign's dimension. The scene must include realistic nighttime lighting, reflections from streetlights, and a vibrant, inviting atmosphere.",
    "لوحة علوية (نهار)": "A photorealistic, eye-level shot of a modern sign mounted on a shop facade on a bustling Egyptian street during the day. The provided design is displayed on the sign. The store is situated between other realistic shops. The scene must have realistic daylight, with natural shadows, reflections, and a sense of depth and atmosphere.",
    "لوحة علوية مضيئة (ليل)": "A photorealistic, eye-level shot of a glowing, modern lightbox sign mounted on a shop facade on a lively Egyptian street at night. The provided design is displayed on the sign. The store is situated between other illuminated shops. The lighting effect should be vibrant, with a realistic glow emanating from the sign and casting soft light on the building and sidewalk, integrating seamlessly with the street's ambient night lighting.",
    "بانر بالعرض في الشارع": "A photorealistic mockup of a large vinyl banner featuring the provided design, stretched horizontally across a typical Egyptian street. The banner is tied with realistic ropes to buildings on both sides. The scene is shot from a street-level perspective, looking up at the banner, with the sky and building tops visible. The lighting should be bright daylight, creating realistic folds and shadows on the banner.",
    "لوحة هرمية (A-Frame)": "A photorealistic shot of a modern, pyramid-style A-frame sign standing on the pavement of a bustling, authentic Egyptian street, positioned realistically in front of a shop entrance. The provided design is mocked up on both visible sides of the sign. The scene is captured in bright, natural daylight, with realistic interactions of light and shadow with the surrounding urban environment.",
    "لافتة شارع (T-Pole)": "A photorealistic mockup of the provided design on a large 'T-pole' billboard, situated in the median strip of a busy Egyptian road with traffic. The shot is from a pedestrian's perspective. The scene should be in bright daylight with a clear sky, showing realistic reflections on the sign and cars.",
    "عرض بروجيكتور ليلي": "A dramatic, photorealistic nighttime shot of the provided logo/design being projected onto the side of a large, textured building wall in an Egyptian city square. The projection should have a realistic glow and slight distortion from the building's texture. The surrounding atmosphere is dark and cinematic.",
    "علم رأسي": "A photorealistic mockup of the provided design on a tall, vertical fabric flag attached to a pole on the facade of a modern building on an Egyptian street. The flag should show realistic folds and movement as if in a gentle breeze. The lighting is bright overcast daylight, creating soft shadows.",
    "بانر رول اب (داخلي)": "A photorealistic indoor shot of the provided design on a roll-up banner stand. The stand is placed in the bright, modern lobby of a corporate building or a high-end mall in Egypt. The background is softly blurred, and the lighting is clean and professional, with realistic reflections on the polished floor.",
    "لوجو مجسم (داخلي)": "A photorealistic, close-up shot of the provided logo expertly mounted as 3D lettering on a modern office reception wall made of dark wood or brushed metal. The lighting is elegant and focused, creating beautiful highlights and shadows on the logo to give it a premium, tactile feel."
  };
    
 const businessCardMockupsCategorized = {
    "مكتبية واحترافية": {
        "مكدسة على مكتب": "A photorealistic mockup showing a neat stack of business cards on a rich, textured dark wood surface. The top card clearly displays the provided design. The lighting is soft and directional, creating deep, realistic shadows and highlighting the card's texture.",
        "داخل علبة شفافة": "A photorealistic mockup of the business card presented inside a crystal-clear acrylic box, placed on a minimalist desk. The scene features soft, diffused lighting that creates clean, sharp reflections and subtle shadows, giving a premium feel.",
        "في يد شخص": "A photorealistic shot where a person with well-groomed hands is holding a business card against a softly blurred, professional office background. The lighting should feel natural, as if from a window, casting gentle shadows and highlighting the card's details.",
        "على مكتب مصمم": "A photorealistic flat lay of the business card on a clean designer's desk, surrounded by relevant items like a laptop, a cup of coffee, and sleek stationery. The lighting is bright and even, creating soft, subtle shadows that give the scene depth.",
        "داخل محفظة جلدية": "A photorealistic mockup with the business card partially peeking out of a premium, brown or black leather cardholder, which lies on a sophisticated surface. The lighting is warm and focused, highlighting the texture of the leather and the details of the card.",
        "على سطح رخامي فاخر": "An elegant, photorealistic arrangement of the business card on a luxurious white or black marble surface, accented with subtle gold elements and a small, out-of-focus plant. The lighting is sophisticated, creating beautiful, soft reflections on the marble and crisp shadows.",
        "مع ظرف وختم شمعي": "A premium, photorealistic scene where the business card is arranged with a high-end, textured paper envelope and a detailed wax seal. The lighting is warm and atmospheric, creating a sense of history and luxury, with soft shadows.",
        "على حامل معدني ذهبي": "A photorealistic mockup featuring the business card resting on a sleek, minimalist golden metal stand. The background is a dark, out-of-focus textured wall, and the scene is lit with a single spotlight, creating a high-end, luxurious feel with sharp highlights and deep shadows.",
        "موضوع على كتاب قديم مفتوح": "A vintage-inspired, photorealistic shot of the business card resting on the page of an open, old book with classic typography. The scene is lit by warm, soft light from a candle or desk lamp, creating a scholarly and timeless mood.",
        "موك اب رقمي على شاشة آيباد": "A photorealistic image of the business card design displayed on the screen of an iPad Pro, which is lying on a modern desk next to an Apple Pencil. The screen has a realistic glare, and the overall lighting is clean and professional, simulating a digital presentation.",
    },
    "إبداعية وفنية": {
        "بتأثير طباعة بارزة": "A dramatic close-up, photorealistic shot emphasizing a tactile, letterpress or embossed effect on the business card, which is made of high-quality, thick cotton paper. The card is angled to catch the light, creating strong highlights and shadows that showcase the texture and depth of the printing.",
        "عائمة بظلال درامية": "A minimalist, photorealistic mockup where the business card appears to be floating in a zero-gravity scene, casting a soft but dramatic shadow on a solid, neutral-colored background. The lighting is focused and clean, making the card pop.",
        "بزاوية تصوير علوية (Flat Lay)": "A clean and modern flat lay composition, shot from directly above. The business card is arranged neatly at an angle on a clean, pastel-colored background, with perfect, even lighting and minimal, soft shadows for a contemporary look.",
        "بجانب فنجان قهوة وبخار": "A cozy, top-down photorealistic shot of the business card lying next to a steaming cup of black coffee on a rustic wooden table. The morning light streams in from a window, creating long, soft shadows and a warm, inviting atmosphere.",
        "على خلفية أسمنتية مع ظل نبات": "A trendy, photorealistic mockup of the business card on a rough concrete surface. A strong, direct light casts a sharp, artistic shadow of a monstera or palm leaf across the scene, creating a modern and organic feel.",
        "مطبوع على بطاقة شفافة (بلاستيك)": "A photorealistic image of the business card design printed on a semi-transparent frosted plastic card. The card is held up by hand against a blurred city lights background at night, causing the lights to beautifully refract through the card.",
        "مرصوف بين أحجار طبيعية": "A unique, photorealistic mockup where the business card is carefully placed between smooth, dark river stones in a zen garden setting. The lighting is soft and natural, as if on an overcast day, creating subtle shadows and a sense of calm and balance.",
        "مع أدوات خطاط ورشات حبر": "An artistic, photorealistic flat lay of the business card surrounded by calligraphy tools, an inkwell, and artistic ink splatters on textured paper. The lighting is bright and clean, highlighting the details of the tools and the texture of the paper.",
        "بطاقات متناثرة بتأثير الحركة": "A dynamic, photorealistic shot of multiple copies of the business card captured as if they are falling through the air, with a slight motion blur. The top-most card is in sharp focus. The background is a solid, clean color, and the lighting is bright and crisp to freeze the action.",
        "مقطوع بالليزر في خشب": "A photorealistic simulation of the business card design laser-etched onto a piece of light-colored wood, like birch or maple. The card is shown at a slight angle on a workshop table, with dramatic side lighting that emphasizes the depth and texture of the engraving.",
    }
  };

  const dynamicBackgrounds = {
      "بوكيه ناعم متحرك": "against a background of soft, out-of-focus bokeh lights that appear to be gently drifting, creating a dreamy and dynamic feel",
      "أشعة ضوء متغيرة": "with subtle, soft light rays shifting across the background, captured as if in a long exposure to show gentle movement",
      "تموجات ماء هادئة": "on a pedestal just above a surface of calm water with very subtle, realistic ripples spreading outwards, frozen in time",
      "غيوم سماوية بطيئة": "as if floating before a background of soft, slow-moving clouds at sunset, giving a sense of serene motion",
      "ظلال أوراق شجر راقصة": "on a surface where the gentle, blurred shadows of tree leaves are cast, suggesting a light breeze and movement",
      "جزيئات ذهبية عائمة": "surrounded by floating, glowing golden dust particles, creating a magical and dynamic atmosphere",
      "ستارة حريرية تتمايل": "in front of a soft, silk curtain that is subtly swaying, captured to show elegant folds and gentle motion",
      "عرض ثلاثي الأبعاد دوار": "on a minimalist rotating platform, with a slight motion blur on the background to indicate slow, smooth rotation"
  };


  const [selectedThreeDEffect, setSelectedThreeDEffect] = useState<string>(Object.values(threeDScenes)[0]);
  const [selectedFacadeMockup, setSelectedFacadeMockup] = useState<string>(Object.values(facadeMockups)[0]);
  const [selectedBusinessCardMockup, setSelectedBusinessCardMockup] = useState<string>(Object.values(businessCardMockupsCategorized["مكتبية واحترافية"])[0]);
  const [selectedDynamicBackground, setSelectedDynamicBackground] = useState<string>(Object.values(dynamicBackgrounds)[0]);


  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenModal) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setShowWelcomeModal(false);
  };


  const mockups = {
    "موكاب اليد": {
      "يد تمسك المنتج بخلفية وردي وزرع": "product held by a hand with a background of lush greenery and a pink, bubbly aesthetic",
      "يد تمسك المنتج أمام حائط بسيط": "A close-up of a hand holding the product against a minimalist, neutral-colored wall.",
      "يد تقدم المنتج للكاميرا": "A hand gently presenting the product towards the camera, with a softly blurred background.",
      "يدان تمسكان المنتج بلطف": "Two hands cupping the product gently, shot from above, on a soft fabric background.",
      "يد تمسك المنتج على الشاطئ": "A hand holding the product outdoors on a sunny beach, with the ocean in the background.",
      "يد تمسك المنتج وسط رشة مياه": "A hand holding the product with a dynamic splash of clean water around it, against a dark background.",
      "يد تخرج من خلفية ملونة": "A hand emerges from a vibrant, single-color paper background to hold the product, creating a pop-art effect.",
      "يد تمسك المنتج وخلفية زفاف بلور": "A hand holding the product with a beautiful, blurred wedding scene in the background, with bokeh lights.",
      "يد تمسك المنتج في مكان فخم": "A well-manicured hand holding the product inside a luxurious interior, like a hotel lobby or high-end store.",
      "يد تمسك المنتج في ورشة عمل": "A hand holding the product in a rustic workshop setting, with tools and wood textures in the background.",
      "يد رياضية تمسك المنتج": "An athletic hand holding the product, possibly with gym equipment or an outdoor trail in the background.",
      "يد تمسك المنتج أمام شاشة لابتوب": "A hand holding the product in front of a glowing laptop screen in a modern office environment.",
      "يد تمسك المنتج في السماء": "A hand holding the product up towards a clear blue sky.",
      "يد أنيقة تمسك المنتج (مانيكير)": "A perfectly manicured hand holding the product with an elegant and sophisticated feel.",
      "يد تخرج المنتج من صندوق هدايا": "a hand carefully lifting the product out of a luxurious, open gift box with ribbon",
      "يد تضع المنتج على رف": "a hand placing the product onto a minimalist wooden shelf against a clean wall",
      "يد تحمل المنتج أثناء الطبخ": "a hand holding the product in a bright, modern kitchen setting, with cooking ingredients blurred in the background",
      "يد طفل تمسك المنتج": "a child's hand gently holding the product, conveying a sense of safety and family",
    },
    "أساسي ونظيف": {
      "خلفية ستوديو بيضا": "on a studio white background with soft shadows",
      "سطح رخام": "on a clean marble surface",
      "على مكتب خشب": "on a wooden desk with soft daylight",
      "على قاعدة أسمنتية بسيطة": "on a simple concrete podium with minimalist styling",
      "على قماش كتان ناعم": "on a soft linen fabric with gentle folds",
      "على خلفية معدنية مصقولة": "on a clean, brushed metal surface with soft, diffused light",
      "داخل صندوق أكريليك شفاف": "placed inside a clear acrylic box, creating clean reflections and a modern look",
      "على قماش حرير فاخر": "on luxurious silk fabric with elegant, flowing drapes and soft lighting",
      "مع خلفية أشكال هندسية": "against a background of minimalist, overlapping geometric shapes and pastel colors",
      "على مجموعة صناديق بيضاء": "on a stack of minimalist white boxes of different sizes, creating a geometric composition",
      "على حائط أسمنتي": "against a textured concrete wall with a single, soft, and natural side light shadow",
      "على رف زجاجي عائم": "on a floating glass shelf against a soft, clean, gradient background",
      "مغمور جزئياً في الماء": "half-submerged in clear, still water inside a transparent container, with a clean and fresh look",
    },
    "طبيعي وعضوي": {
      "على منصة وسط أحجار وأوراق شجر": "on a podium surrounded by smooth stones and green leaves, with soft, clean lighting",
      "على طبق خشب مع ورد و دخان خفيف": "on a wooden plate with chamomile flowers and soft smoke, placed on a gentle linen cloth",
      "في غابة وسط الضباب والزرع": "on a mossy log in a misty forest, surrounded by small wildflowers and water droplets",
      "يظهر من الماء الصافي": "emerging from clear, still water with ripples",
      "على رمال صحراوية ناعمة": "on fine desert sand with a warm, sunny atmosphere",
      "على صخرة بركانية سوداء": "on a black volcanic rock, with dramatic contrast and a raw, natural feel",
      "وسط حقل لافندر": "in the middle of a beautiful lavender field during a sunny day",
      "على قطعة جليد شفافة": "placed on a clear block of ice, with water droplets and a cool, fresh aesthetic",
      "محاط بالقهوة وحبوب البن": "surrounded by rich, dark coffee beans and a steaming cup of coffee",
      "على قطعة خشب على الشاطئ": "on a piece of weathered driftwood on a sandy beach, with soft waves in the background",
      "وسط الطحالب الخضراء": "nestled in fresh, vibrant green moss in a lush forest setting with dappled sunlight",
      "مع أوراق الخريف": "surrounded by a scatter of colorful, crisp autumn leaves on the ground",
      "على خلية نحل": "on a real honeycomb with rich, golden honey slowly dripping from it",
      "في مشهد ثلجي": "against a backdrop of a serene, soft, snowy landscape with gentle light",
    },
    "إضاءة إبداعية وفنية": {
      "بإضاءة شباك درامية وظل حاد": "with dramatic, sharp shadows from a window, creating a high-contrast, artistic look",
      "على قاعدة أسمنتية بإضاءة فخمة": "on a concrete pedestal with dramatic, focused lighting and a minimalist, luxurious feel",
      "بإضاءة الشمس وقت الغروب (Golden Hour)": "bathed in the warm, a golden light of a sunset, creating long, soft shadows",
      "على سطح غامق ومتسلط عليه ضوء سبوت": "on a dark surface with a single, dramatic spotlight shining down from above",
      "على سطح مبلول وعاكس أضواء نيون": "on a wet surface reflecting vibrant neon lights, creating a futuristic, dreamy mood",
      "مع خلفية فيها أضواء بوكيه سايحة": "with a blurred background of twinkling bokeh lights, giving a magical and festive feel",
      "صورة أبيض وأسود بتبرز ملامح المنتج": "in a high-contrast black and white style, focusing on texture and form",
      "المنتج طاير في الهوا مع عناصر تانية": "floating in the air, surrounded by elements like wood fragments and botanicals, against a warm gradient background",
      "مع انعكاسات ضوء من كريستال": "with caustic light reflections from a nearby crystal or prism",
      "مغمور في إضاءة لونية (أزرق وأحمر)": "submerged in dual-tone colored lighting, like blue and red, for a cyberpunk feel",
      "تحت الماء مع فقاعات هواء": "photographed underwater, with streams of light from the surface and floating air bubbles",
      "بإسقاط ضوئي (Projector) لأشكال طبيعية": "with a projector casting patterns of leaves and branches onto the product and background",
      "مع خطوط ضوء نيون ملونة": "in a dark setting with long-exposure, colorful neon light trails moving around the product",
      "داخل دخان ملون كثيف": "emerging from dense, billowing clouds of colored smoke for a mysterious and vibrant look",
      "إضاءة من الأسفل": "lit dramatically from below, creating a mysterious silhouette and a powerful glow against a dark background",
      "خلف زجاج عليه قطرات مطر": "viewed through a window covered in realistic raindrops, with soft, blurry city lights in the background",
    },
    "فاخر وراقي": {
        "على قماش حرير أسود": "on a backdrop of black silk cloth, with a single, elegant pearl placed next to it, conveying luxury",
        "على منصة رخامية متشققة": "on a pedestal of cracked marble with delicate gold veins running through it, under soft, dramatic lighting",
        "داخل صندوق مجوهرات مخملي": "placed inside a luxurious, velvet-lined jewelry box with soft, focused lighting that highlights the product's details",
        "إضاءة سينمائية على سطح عاكس": "with dramatic, cinematic lighting on a dark, highly reflective surface, creating stunning highlights and reflections",
        "محاط بأشكال ذهبية عائمة": "surrounded by abstract, floating geometric gold shapes against a dark, moody background, creating a high-end feel",
        "مع زجاجة عطر وشريط حرير": "artfully arranged next to a beautiful, minimalist perfume bottle and a delicate, flowing silk ribbon",
    },
    "تقني ومستقبلي": {
        "على منصة مضيئة في غرفة سيرفرات": "on a sleek, glowing platform inside a server room with a blurred background of blinking lights and cables",
        "يطفو في الفضاء مع عناصر هولوجرام": "floating in a zero-gravity environment, surrounded by interactive holographic UI elements and data streams",
        "على سطح كاربون فايبر": "on a dark carbon fiber surface with clean, sharp, and cool blue accent lighting",
        "خلفية لوحة دوائر إلكترونية": "with a clean, minimalist composition against a background featuring a subtle, artistic circuit board pattern",
        "مفكك ومكوناته عائمة": "deconstructed, with its internal components floating neatly around the main body in an organized, exploded view",
        "أمام مدينة مستقبلية": "on a futuristic pedestal against a background of a sprawling, detailed sci-fi city at dusk",
    },
    "مطبخ ومأكولات": {
        "على لوح تقطيع خشبي": "on a rustic wooden cutting board, surrounded by fresh, vibrant herbs like rosemary and basil, and scattered spices",
        "على جزيرة مطبخ عصرية": "on a clean, modern kitchen island made of marble or stainless steel, with the rest of the kitchen softly blurred in the background",
        "مع رشة حليب أو سائل": "with a dynamic splash of milk or another relevant liquid captured in mid-air around the product, against a clean background",
        "في نزهة على مفرش كاروهات": "on a classic red and white checkered tablecloth in a sunny picnic setting, with a wicker basket and fresh bread nearby",
        "محاط بمكونات الخبز": "surrounded by artfully scattered baking ingredients like flour, whole eggs, and dark chocolate chips on a wooden surface",
        "على طبق حجري مع جبن وعنب": "presented on a natural slate platter, accompanied by a piece of artisanal cheese, fresh grapes, and a sprig of thyme",
    },
    "حمام وسبا": {
        "على حافة حوض استحمام رخامي": "on the edge of a luxurious marble bathtub, with soft, atmospheric steam gently rising in the background",
        "على كومة من المناشف البيضاء": "resting on a stack of clean, perfectly folded, fluffy white towels, conveying a sense of freshness and comfort",
        "محاط بالشموع والأحجار وزهرة الأوركيد": "surrounded by softly glowing candles, smooth, dark spa stones, and a single, elegant orchid flower for a serene mood",
        "على صينية خشبية مع أملاح الاستحمام": "on a rustic wooden tray with scattered bath salts, a small bottle of essential oil, and a few flower petals",
        "بجانب حوض حمام عصري": "placed next to a modern bathroom sink with a sleek chrome faucet and a soft-focus reflection in the mirror",
        "مع قطرات ماء على بلاط أخضر": "with realistic, glistening water droplets on the product's surface, against a background of elegant, deep green tiles",
    },
  };

  const categoryColors: { [key: string]: { main: string; hover: string; ring: string; text: string; circle: string; } } = {
    "موكاب اليد": { main: 'bg-green-600', hover: 'hover:bg-green-800/60', ring: 'focus:ring-green-500', text: 'text-green-300', circle: 'bg-green-400' },
    "أساسي ونظيف": { main: 'bg-orange-600', hover: 'hover:bg-orange-800/60', ring: 'focus:ring-orange-500', text: 'text-orange-300', circle: 'bg-orange-400' },
    "طبيعي وعضوي": { main: 'bg-yellow-600', hover: 'hover:bg-yellow-800/60', ring: 'focus:ring-yellow-500', text: 'text-yellow-300', circle: 'bg-yellow-400' },
    "إضاءة إبداعية وفنية": { main: 'bg-purple-600', hover: 'hover:bg-purple-800/60', ring: 'focus:ring-purple-500', text: 'text-purple-300', circle: 'bg-purple-400' },
    "فاخر وراقي": { main: 'bg-blue-600', hover: 'hover:bg-blue-800/60', ring: 'focus:ring-blue-500', text: 'text-blue-300', circle: 'bg-blue-400' },
    "تقني ومستقبلي": { main: 'bg-indigo-600', hover: 'hover:bg-indigo-800/60', ring: 'focus:ring-indigo-500', text: 'text-indigo-300', circle: 'bg-indigo-400' },
    "مطبخ ومأكولات": { main: 'bg-amber-600', hover: 'hover:bg-amber-800/60', ring: 'focus:ring-amber-500', text: 'text-amber-300', circle: 'bg-amber-400' },
    "حمام وسبا": { main: 'bg-teal-600', hover: 'hover:bg-teal-800/60', ring: 'focus:ring-teal-500', text: 'text-teal-300', circle: 'bg-teal-400' },
    "موك اب بزنس كارد": { main: 'bg-yellow-600', hover: 'hover:bg-yellow-800/60', ring: 'focus:ring-yellow-500', text: 'text-yellow-300', circle: 'bg-yellow-400' },
  };

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    setError(null);
    setSwapImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      setError("من فضلك ، ارفع الصورة تحياتى وائل سمير.");
      return;
    }

    let descriptionPrefix = '';
    let finalPrompt = '';
    let finalSwapImage: File | null = null;

    switch (mode) {
      case GenerationMode.Mockup:
        descriptionPrefix = 'The product is the main subject in the uploaded image. ';
        finalPrompt = `${descriptionPrefix}Create a close-up, highly detailed product shot. Place the product ${selectedMockup}. The product should be the clear focal point, filling a significant portion of the frame. The overall image must be photorealistic, high-end, and visually stunning with rich details.`;
        break;
      case GenerationMode.ThreeDStudio:
         if (!selectedThreeDEffect) {
            setError("لو سمحت، اختار مؤثر الثري دي.");
            return;
        }
        descriptionPrefix = 'The product is the main subject in the uploaded image. ';
        finalPrompt = `${descriptionPrefix}Create a close-up, highly detailed product shot. Place the product ${selectedThreeDEffect}. The product should be the clear focal point, filling a significant portion of the frame. The scene should be a high-end, highly detailed, photorealistic 3D render, and the real product should be perfectly integrated into it with matching lighting, shadows, and reflections.`;
        break;
      case GenerationMode.FacadeMockup:
        if (!selectedFacadeMockup) {
            setError("لو سمحت، اختار تصميم الواجهة.");
            return;
        }
        descriptionPrefix = 'The uploaded image is a design/logo to be used on a sign or storefront. ';
        finalPrompt = `${descriptionPrefix}${selectedFacadeMockup}`;
        break;
      case GenerationMode.BusinessCardMockup:
        if (!selectedBusinessCardMockup) {
            setError("لو سمحت، اختار طريقة عرض الكارت.");
            return;
        }
        descriptionPrefix = 'The uploaded image is a business card design. Create a photorealistic mockup image displaying this business card. The scene should be ';
        finalPrompt = `${descriptionPrefix}${selectedBusinessCardMockup}`;
        finalSwapImage = null;
        break;
      case GenerationMode.DynamicBackground:
        if (!selectedDynamicBackground) {
            setError("لو سمحت، اختار التأثير الديناميكي.");
            return;
        }
        descriptionPrefix = 'The product is the main subject in the uploaded image. ';
        finalPrompt = `${descriptionPrefix}Create a close-up, highly detailed product shot. Place the product ${selectedDynamicBackground}. The product should be the clear focal point, filling a significant portion of the frame. The overall image must be photorealistic, high-end, and visually stunning with rich details.`;
        break;
      case GenerationMode.Swap:
        if (!swapImage) {
            setError("لو سمحت، ارفع صورة المشهد اللي عايز تدمج فيه المنتج.");
            return;
        }
        descriptionPrefix = 'The product is the main subject in the uploaded image. ';
        finalPrompt = `${descriptionPrefix}Take the main product from the first image and place it realistically and prominently in the second image. The product should be the clear focal point, scaled appropriately but large enough to be seen clearly. Match the lighting, shadows, and overall style of the scene perfectly.`;
        finalSwapImage = swapImage;
        break;
    }

    setIsLoading(true);
    setError(null);
    setCurrentGeneratedImageUrl(null);
    setGeneratedImageUrls(null);
    
    try {
      const [base64Data1, base64Data2] = await generateProductImage(productImage, finalPrompt, finalSwapImage);
      const newImageUrl1 = `data:image/png;base64,${base64Data1}`;
      const newImageUrl2 = `data:image/png;base64,${base64Data2}`;
      setGeneratedImageUrls([newImageUrl1, newImageUrl2]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "للأسف حصل خطأ واحنا بنعمل الصورة. حاول تاني.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelection = (selectedUrl: string) => {
    setCurrentGeneratedImageUrl(selectedUrl);
    setHistory(prevHistory => [selectedUrl, ...prevHistory].slice(0, 10)); // Keep history to a reasonable size
    setGeneratedImageUrls(null);
  };

  const handleCreateNew = () => {
    setCurrentGeneratedImageUrl(null);
    setGeneratedImageUrls(null);
    setError(null);
  };

  const dataURLtoFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleReuseImage = async (imageUrl: string) => {
    const file = await dataURLtoFile(imageUrl, 'reused-product.png');
    setProductImage(file);
    setProductImageUrl(imageUrl);
    setCurrentGeneratedImageUrl(null);
    setGeneratedImageUrls(null);
    setHistory([]);
    setError(null);
  };

  const getEffectVisual = (effectName: string) => {
    switch (effectName) {
      case "بوكيه ناعم متحرك":
        return <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-70 blur-md"></div>;
      case "أشعة ضوء متغيرة":
        return <div className="w-full h-full bg-gradient-to-r from-yellow-300 via-yellow-300/10 to-transparent opacity-80"></div>;
      case "تموجات ماء هادئة":
        return <div className="w-full h-full bg-gradient-to-b from-cyan-400 to-blue-600 opacity-70"></div>;
      case "غيوم سماوية بطيئة":
        return <div className="w-full h-full bg-gradient-to-b from-orange-300 to-sky-500 opacity-70"></div>;
      case "ظلال أوراق شجر راقصة":
        return <div className="w-full h-full bg-gradient-to-br from-green-400 to-lime-500 opacity-70"></div>;
      case "جزيئات ذهبية عائمة":
        return <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/80 via-transparent to-transparent"></div>;
      case "ستارة حريرية تتمايل":
        return <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400 opacity-60"></div>;
      case "عرض ثلاثي الأبعاد دوار":
        return <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-70"></div>;
      default:
        return <div className="w-full h-full bg-gray-700"></div>;
    }
  };
  
  if (generatedImageUrls) {
    return (
      <>
        <ImageSelection
          urls={generatedImageUrls}
          onSelect={handleImageSelection}
          onGoBack={handleCreateNew}
        />
        <Marquee />
      </>
    );
  }

  if (currentGeneratedImageUrl && productImageUrl) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20">
          <div className="w-full max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500 mb-4">صورتك الجديدة جاهزة!</h1>
            <p className="text-gray-300 mb-8">حرك السلايدر عشان تقارن بين الصورة الأصلية والصورة اللي عملها الذكاء الاصطناعي.</p>
          </div>
          <ImageComparator 
            beforeImageUrl={productImageUrl} 
            afterImageUrl={currentGeneratedImageUrl} 
          />
          <div className="w-full max-w-2xl mx-auto text-center mt-8">
            <button 
                onClick={handleCreateNew}
                className="w-full max-w-xs mx-auto bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <RefreshIcon />
                اعمل صورة جديدة
              </button>
          </div>
          {history.length > 0 && (
            <div className="w-full max-w-4xl mx-auto">
              <HistoryTray 
                history={history} 
                currentImageUrl={currentGeneratedImageUrl} 
                onSelect={setCurrentGeneratedImageUrl}
                onReuse={handleReuseImage}
              />
            </div>
          )}
        </div>
        <Marquee />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20">
        {isLoading && <LoadingOverlay productImageUrl={productImageUrl} />}
        {showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} />}
        {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
        
          <div className="absolute top-5 left-5 flex items-center gap-3 z-20">
              <a href="https://wa.me/201222355769" target="_blank" rel="noopener noreferrer" title="تواصل على واتساب" className="bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-sm p-2.5 rounded-full text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110">
                  <WhatsAppIcon />
              </a>
              <a href="mailto:algammal646@gmail.com" title="أرسل بريد إلكتروني" className="bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-sm p-2.5 rounded-full text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110">
                  <MailIcon />
              </a>
              <button onClick={() => setIsProfileModalOpen(true)} title="عرض معلومات المصمم" className="bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-sm p-2.5 rounded-full text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110">
                  <UserIcon />
              </button>
          </div>

        <div className="w-full max-w-2xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500 mb-2">استوديو المنتجات الذكى</h1>
            <p className="text-md text-gray-400 mt-2">تصميم م. وائل الجـمّال</p>
          </header>
          <main className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <ImageUploader 
                id="product-image"
                label={mode === GenerationMode.BusinessCardMockup ? "1. ارفع صورة الكارت" : "1. ارفع صورة منتجك أو تصميمك"}
                onFileSelect={(file, url) => {
                  setProductImage(file);
                  setProductImageUrl(url);
                }}
                isRequired
                previewUrl={productImageUrl}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  2. اختار طريقة التصميم
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 bg-gray-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleModeChange(GenerationMode.Mockup)}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 ${mode === GenerationMode.Mockup ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    <LayoutIcon /> موك أب منتج
                  </button>
                   <button
                    type="button"
                    onClick={() => handleModeChange(GenerationMode.ThreeDStudio)}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 ${mode === GenerationMode.ThreeDStudio ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                   <CubeIcon/> استوديو 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange(GenerationMode.DynamicBackground)}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 ${mode === GenerationMode.DynamicBackground ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                   <WandIcon/> تأثيرات ديناميكية
                  </button>
                   <button
                    type="button"
                    onClick={() => handleModeChange(GenerationMode.FacadeMockup)}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 ${mode === GenerationMode.FacadeMockup ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                   <StorefrontIcon/> موك اب واجهات
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange(GenerationMode.BusinessCardMockup)}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 ${mode === GenerationMode.BusinessCardMockup ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                   <BusinessCardIcon/> موك اب بزنس كارد
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange(GenerationMode.Swap)}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 ${mode === GenerationMode.Swap ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                   <SwapIcon/> دمج صورة بأخرى
                  </button>
                </div>
              </div>

              {mode === GenerationMode.Mockup && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    3. اختار الاستايل
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(mockups).map(([category, options]) => (
                      <CustomDropdown
                        key={category}
                        category={category}
                        options={options}
                        selectedMockup={selectedMockup}
                        onSelect={setSelectedMockup}
                        colors={categoryColors[category]}
                        isAnySelected={Object.values(options).includes(selectedMockup)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {mode === GenerationMode.Swap && (
                <ImageUploader 
                  id="swap-image"
                  label="2. ارفع صورة المشهد"
                  onFileSelect={(file) => setSwapImage(file)}
                  isRequired
                />
              )}

              {mode === GenerationMode.ThreeDStudio && (
                  <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                          3. اختار مؤثر الثري دي
                      </label>
                      <div className="relative">
                          <select
                              value={selectedThreeDEffect}
                              onChange={(e) => setSelectedThreeDEffect(e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent py-3 px-4 appearance-none transition-all duration-200 text-right"
                          >
                              {Object.entries(threeDScenes).map(([name, prompt]) => (
                                  <option key={prompt} value={prompt} className="bg-gray-800 text-gray-200">
                                      {name}
                                  </option>
                              ))}
                          </select>
                           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-400">
                               <ChevronDownIcon />
                           </div>
                      </div>
                  </div>
              )}

              {mode === GenerationMode.DynamicBackground && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    3. اختار التأثير الديناميكي
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(dynamicBackgrounds).map(([name, prompt]) => {
                      const isSelected = selectedDynamicBackground === prompt;
                      return (
                        <button
                          type="button"
                          key={prompt}
                          onClick={() => setSelectedDynamicBackground(prompt)}
                          aria-pressed={isSelected}
                          className={`relative w-full aspect-square flex flex-col items-center justify-end p-2 text-center rounded-lg border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 ${
                            isSelected ? 'border-sky-500 bg-sky-900/40' : 'border-gray-700 bg-gray-800/50 hover:border-sky-600'
                          }`}
                        >
                          <div className="absolute inset-2 rounded-md overflow-hidden" aria-hidden="true">
                            {getEffectVisual(name)}
                          </div>
                          <span className="relative text-xs font-semibold text-white z-10 drop-shadow-md">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mode === GenerationMode.FacadeMockup && (
                  <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                          3. اختار تصميم الواجهة
                      </label>
                      <div className="relative">
                           <select
                              value={selectedFacadeMockup}
                              onChange={(e) => setSelectedFacadeMockup(e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent py-3 px-4 appearance-none transition-all duration-200 text-right"
                          >
                              {Object.entries(facadeMockups).map(([name, prompt]) => (
                                  <option key={prompt} value={prompt} className="bg-gray-800 text-gray-200">
                                      {name}
                                  </option>
                              ))}
                          </select>
                           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-400">
                               <ChevronDownIcon />
                           </div>
                      </div>
                  </div>
              )}

              {mode === GenerationMode.BusinessCardMockup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      3. اختار طريقة عرض الكارت
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(businessCardMockupsCategorized).map(([category, options]) => (
                        <CustomDropdown
                          key={category}
                          category={category}
                          options={options}
                          selectedMockup={selectedBusinessCardMockup}
                          onSelect={setSelectedBusinessCardMockup}
                          colors={categoryColors["موك اب بزنس كارد"]}
                          isAnySelected={Object.values(options).includes(selectedBusinessCardMockup)}
                        />
                      ))}
                    </div>
                  </div>
              )}


              {error && <p className="text-red-400 text-sm text-center animate-fade-in-fast">{error}</p>}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <span>جاري التنفيذ...</span>
                  ) : (
                    <>
                      <SparklesIcon />
                      اعمل الصورة
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
      <Marquee />
      <style>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4B5563 #1F2937;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 10px;
          border: 2px solid #1F2937;
        }
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        .bg-amber-600 { background-color: #D97706; }
        .hover\\:bg-amber-800\\/60:hover { background-color: rgba(120, 53, 15, 0.6); }
        .focus\\:ring-amber-500:focus { --tw-ring-color: #F59E0B; }
        .text-amber-300 { color: #FCD34D; }
        .bg-amber-400 { background-color: #FBBF24; }
        .bg-teal-600 { background-color: #0D9488; }
        .hover\\:bg-teal-800\\/60:hover { background-color: rgba(19, 78, 74, 0.6); }
        .focus\\:ring-teal-500:focus { --tw-ring-color: #14B8A6; }
        .text-teal-300 { color: #5EEAD4; }
        .bg-teal-400 { background-color: #2DD4BF; }
      `}</style>
    </>
  );
};

export default App;