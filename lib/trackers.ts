export type Option = { text: string; score: number };
export type Question = { q: string; sub?: string; options: Option[] };
export type TierKey = "good" | "mid" | "low";
export type ProductIconKey =
  | "cell" | "omega" | "energy" | "sleep" | "brain"
  | "shield" | "mineral" | "pack" | "liver" | "antioxidant";

export type Product = { name: string; why: string; icon: ProductIconKey };
export type Tip = { icon: string; text: string };
export type Insight = { text: string };
export type TierData = {
  label: string;
  summary: string;
  insights: Insight[];
  products: Product[];
  tips: Tip[];
};
export type Tracker = {
  id: string;
  icon: string;
  name: string;
  desc: string;
  color: string;
  questions: Question[];
  tiers: Record<TierKey, TierData>;
};

export const trackers: Tracker[] = [
  {
    id: "fatigue",
    icon: "⚡",
    name: "Fatigue Tracker",
    desc: "Assess your daily energy drain and recovery patterns to understand what may be affecting your vitality.",
    color: "#00529b",
    questions: [
      {
        q: "How would you describe your energy level when you first wake up?",
        sub: "Think about your average morning over the past month.",
        options: [
          { text: "Refreshed and ready — I jump out of bed", score: 0 },
          { text: "Okay after about 30 minutes", score: 1 },
          { text: "Groggy for most of the morning", score: 2 },
          { text: "Exhausted — like I never slept at all", score: 3 },
        ],
      },
      {
        q: "How often do you experience an afternoon energy crash?",
        sub: "An energy crash is a sudden drop in alertness, usually between 1–4 PM.",
        options: [
          { text: "Rarely or never", score: 0 },
          { text: "1–2 times per week", score: 1 },
          { text: "3–4 times per week", score: 2 },
          { text: "Almost every day", score: 3 },
        ],
      },
      {
        q: "How many cups of coffee or caffeinated drinks do you need to get through the day?",
        options: [
          { text: "None — I don't rely on caffeine", score: 0 },
          { text: "1 cup, just a preference", score: 1 },
          { text: "2–3 cups, I need it to function", score: 2 },
          { text: "4 or more — I can't function without it", score: 3 },
        ],
      },
      {
        q: "After a full night's sleep (7–8 hours), how rested do you feel?",
        options: [
          { text: "Fully rested and restored", score: 0 },
          { text: "Mostly rested, slightly tired", score: 1 },
          { text: "Still tired — sleep doesn't feel restorative", score: 2 },
          { text: "Just as tired as before sleeping", score: 3 },
        ],
      },
      {
        q: "How often does physical or mental fatigue affect your daily work or activities?",
        options: [
          { text: "Almost never — my energy supports my day", score: 0 },
          { text: "Occasionally, maybe once a week", score: 1 },
          { text: "A few times a week — it slows me down", score: 2 },
          { text: "Daily — fatigue significantly limits me", score: 3 },
        ],
      },
    ],
    tiers: {
      good: {
        label: "✅ Healthy Energy Range",
        summary: "Your fatigue patterns look healthy! Your body appears to be recovering and maintaining energy well.",
        insights: [
          { text: "<strong>Recovery is working.</strong> Your sleep appears restorative and your energy supports daily activities — a sign of good foundational health." },
          { text: "<strong>Low caffeine dependency</strong> suggests your body is generating natural cellular energy effectively." },
          { text: "<strong>Maintain this momentum</strong> by supporting your cellular health daily with quality nutrition." },
        ],
        products: [
          { name: "USANA CellSentials®", why: "Supports <em>ongoing cellular energy production</em> and antioxidant protection — your daily wellness foundation.", icon: "cell" },
          { name: "BiOmega™", why: "Omega-3s <em>support healthy brain function</em> and help maintain the sustained energy you're already experiencing.", icon: "omega" },
        ],
        tips: [
          { icon: "🌙", text: "Keep a consistent sleep schedule — even on weekends — to protect your natural energy rhythm." },
          { icon: "💧", text: "Stay well hydrated. Even mild dehydration can trigger afternoon fatigue." },
          { icon: "🥗", text: "Continue eating balanced, whole-food meals to maintain your stable energy levels." },
          { icon: "🏃", text: "Regular moderate exercise further supports healthy cellular energy production." },
        ],
      },
      mid: {
        label: "⚠️ Moderate Fatigue Detected",
        summary: "Your responses suggest moderate fatigue that may be affecting your daily quality of life. This is common — and supportable.",
        insights: [
          { text: "<strong>Cellular energy production</strong> may benefit from additional nutritional support, particularly CoQ10 and key micronutrients." },
          { text: "<strong>Caffeine reliance</strong> can mask underlying energy deficiencies — consider supporting your energy at the cellular level instead." },
          { text: "<strong>Recovery quality</strong> may be suboptimal. Nutrients like magnesium play a key role in restorative sleep and morning energy." },
        ],
        products: [
          { name: "CoQuinone® 30", why: "Contains CoQ10 + alpha-lipoic acid to <em>support mitochondrial energy production</em> at the cellular level.", icon: "energy" },
          { name: "USANA CellSentials®", why: "Comprehensive micronutrient foundation with InCelligence™ technology to <em>support cellular renewal</em> and vitality.", icon: "cell" },
          { name: "MagneCal D™", why: "Magnesium <em>supports muscle relaxation and quality rest</em>, helping your body recover energy overnight.", icon: "mineral" },
        ],
        tips: [
          { icon: "😴", text: "Aim for 7–9 hours of uninterrupted sleep. Set a non-negotiable bedtime this week." },
          { icon: "☀️", text: "Get 10–15 minutes of morning sunlight to help reset your circadian rhythm." },
          { icon: "🍽️", text: "Avoid skipping meals — blood sugar dips are a major driver of afternoon crashes." },
          { icon: "📵", text: "Reduce screen exposure 1 hour before bed to improve sleep quality." },
        ],
      },
      low: {
        label: "🔴 High Fatigue — Support Recommended",
        summary: "Your responses indicate significant fatigue that is consistently affecting your daily life. Targeted nutritional support may help.",
        insights: [
          { text: "<strong>Persistent fatigue</strong> of this level often reflects gaps in foundational micronutrient intake — particularly B vitamins, CoQ10, and magnesium." },
          { text: "<strong>Non-restorative sleep</strong> combined with daily exhaustion may indicate your cells aren't getting the fuel and recovery support they need." },
          { text: "<strong>High caffeine dependency</strong> can disrupt sleep architecture, creating a fatigue cycle that's hard to break without addressing root causes nutritionally." },
        ],
        products: [
          { name: "USANA HealthPak™", why: "The most comprehensive USANA daily program — <em>supports cellular energy, antioxidant protection, and essential micronutrient replenishment</em> in convenient AM/PM packets.", icon: "pack" },
          { name: "CoQuinone® 30", why: "<em>Supports mitochondrial function and cellular ATP production</em> — the core engine of your energy levels.", icon: "energy" },
          { name: "Pure Rest™", why: "Melatonin supplement to <em>support a natural, restful sleep cycle</em> — helping your body genuinely recover overnight.", icon: "sleep" },
        ],
        tips: [
          { icon: "🩺", text: "Consider speaking with your doctor to rule out any underlying conditions that may be contributing to your fatigue." },
          { icon: "📅", text: "Start a simple sleep journal to track what worsens or improves your mornings." },
          { icon: "🚶", text: "Light walking (even 10 minutes) has been shown to support energy levels better than rest alone." },
          { icon: "🥗", text: "Prioritize iron-rich foods (leafy greens, legumes) — iron deficiency is a common hidden cause of fatigue." },
        ],
      },
    },
  },
  {
    id: "energy",
    icon: "🔋",
    name: "Energy Level Tracker",
    desc: "Evaluate your sustained energy, mental clarity, and physical drive throughout the day.",
    color: "#007dc3",
    questions: [
      {
        q: "How would you rate your overall physical energy on a typical day?",
        sub: "Consider your average across the last 2–3 weeks.",
        options: [
          { text: "High — I feel strong and physically capable all day", score: 0 },
          { text: "Moderate — okay but not great", score: 1 },
          { text: "Low — I frequently feel physically drained", score: 2 },
          { text: "Very low — basic tasks take significant effort", score: 3 },
        ],
      },
      {
        q: "How often do you experience mental fog or difficulty concentrating?",
        options: [
          { text: "Rarely — my mind is generally clear and sharp", score: 0 },
          { text: "Occasionally, maybe once or twice a week", score: 1 },
          { text: "Often — 3 or more days a week", score: 2 },
          { text: "Almost daily — it significantly affects my work", score: 3 },
        ],
      },
      {
        q: "How is your motivation and drive to tackle tasks or pursue goals?",
        options: [
          { text: "Strong — I feel motivated and purposeful", score: 0 },
          { text: "Fluctuates, but generally okay", score: 1 },
          { text: "Often low — I struggle to get started", score: 2 },
          { text: "Very low — I feel unmotivated most of the time", score: 3 },
        ],
      },
      {
        q: "After moderate physical activity (e.g. a brisk 20-minute walk), how do you feel?",
        options: [
          { text: "Energized — exercise gives me a boost", score: 0 },
          { text: "Fine, normal tiredness that passes quickly", score: 1 },
          { text: "Quite tired, need to rest for an extended period", score: 2 },
          { text: "Exhausted — I avoid physical activity because of how it makes me feel", score: 3 },
        ],
      },
      {
        q: "How consistent is your energy throughout the day?",
        options: [
          { text: "Consistent from morning to evening", score: 0 },
          { text: "A slight dip in the afternoon but manageable", score: 1 },
          { text: "Significant highs and lows throughout the day", score: 2 },
          { text: "Unpredictable — I never know how I'll feel hour to hour", score: 3 },
        ],
      },
    ],
    tiers: {
      good: {
        label: "✅ Strong Energy Profile",
        summary: "Your energy profile looks strong! You're maintaining good physical vitality and mental sharpness.",
        insights: [
          { text: "<strong>Consistent daily energy</strong> suggests your cellular energy production is working well. Well done maintaining this." },
          { text: "<strong>Good exercise tolerance</strong> reflects healthy mitochondrial function and cardiovascular support." },
          { text: "<strong>Mental clarity</strong> indicates your brain is receiving adequate nutrients and oxygen." },
        ],
        products: [
          { name: "USANA CellSentials®", why: "Maintain your strong energy foundation with <em>daily antioxidant and micronutrient support</em> at the cellular level.", icon: "cell" },
          { name: "BiOmega™", why: "Omega-3s <em>support brain health and cognitive clarity</em> — helping you maintain your sharp mental focus.", icon: "omega" },
        ],
        tips: [
          { icon: "🏋️", text: "Keep up with regular physical activity — it compounds your body's natural energy systems." },
          { icon: "🧠", text: "Protect your mental energy with regular breaks and deep work sessions." },
          { icon: "💤", text: "Consistent quality sleep is the single biggest driver of sustained daily energy." },
          { icon: "🥦", text: "Continue eating nutrient-dense whole foods to fuel your cellular engines." },
        ],
      },
      mid: {
        label: "⚠️ Moderate Energy Concerns",
        summary: "Your energy levels have room for meaningful improvement. Targeted nutritional support may help restore your vitality.",
        insights: [
          { text: "<strong>Energy inconsistency</strong> often points to suboptimal mitochondrial function — your cells' power generators may need additional nutritional fuel." },
          { text: "<strong>Mental fog</strong> is frequently linked to insufficient omega-3s, B vitamins, and antioxidant support for brain cells." },
          { text: "<strong>Fluctuating motivation</strong> can be tied to blood sugar instability and micronutrient gaps that affect neurotransmitter function." },
        ],
        products: [
          { name: "CopaPrime+™", why: "Bacopa monnieri + coffee cherry extract <em>supports cognitive performance, mental clarity, and focus</em>.", icon: "brain" },
          { name: "USANA CellSentials®", why: "<em>Supports foundational cellular energy</em> through a comprehensive vitamin, mineral, and antioxidant complex.", icon: "cell" },
          { name: "BiOmega™", why: "EPA and DHA omega-3s <em>support brain function and healthy energy metabolism</em>.", icon: "omega" },
        ],
        tips: [
          { icon: "🍳", text: "Never skip breakfast — a protein-rich morning meal stabilizes energy for the entire day." },
          { icon: "🚶", text: "A 10-minute walk after lunch significantly reduces afternoon energy crashes." },
          { icon: "💧", text: "Drink water before every meal — dehydration commonly mimics low energy." },
          { icon: "📱", text: "Reduce social media scrolling — mental fragmentation drains energy faster than most physical activities." },
        ],
      },
      low: {
        label: "🔴 Low Energy — Support Recommended",
        summary: "Your responses indicate significantly low energy affecting your daily life, work, and motivation. Nutritional support and lifestyle adjustment may help.",
        insights: [
          { text: "<strong>Persistent low physical and mental energy</strong> together suggest your body's cellular energy systems may need comprehensive support." },
          { text: "<strong>Low exercise tolerance</strong> reflects reduced mitochondrial capacity — the energy factories inside your cells may need CoQ10 and micronutrient support." },
          { text: "<strong>Motivation and cognitive clarity</strong> are directly affected by nutrient status, particularly B vitamins, omega-3s, and antioxidants." },
        ],
        products: [
          { name: "USANA HealthPak™", why: "The complete USANA daily system — <em>supports every dimension of energy</em> from cellular fuel to cognitive function and physical recovery.", icon: "pack" },
          { name: "CoQuinone® 30", why: "CoQ10 <em>directly supports mitochondrial ATP production</em> — your cells' primary energy currency.", icon: "energy" },
          { name: "CopaPrime+™", why: "<em>Supports mental performance and brain energy</em> through clinically studied botanical extracts.", icon: "brain" },
        ],
        tips: [
          { icon: "🩺", text: "Please consult a healthcare provider — persistent low energy can have underlying medical causes worth investigating." },
          { icon: "🍽️", text: "Adopt a low-glycemic diet to smooth out energy crashes and sustain brain fuel throughout the day." },
          { icon: "🌿", text: "Start small — even 5 minutes of gentle movement daily begins to rebuild your body's energy capacity." },
          { icon: "😴", text: "Prioritize 8 hours of sleep above all else this week. Energy recovery is impossible without it." },
        ],
      },
    },
  },
  {
    id: "immune",
    icon: "🛡️",
    name: "Immune Strength Tracker",
    desc: "Assess the resilience of your immune response and your body's natural defense capacity.",
    color: "#062460",
    questions: [
      {
        q: "How many times per year do you typically get a cold or flu?",
        options: [
          { text: "Rarely — 0 to 1 time per year", score: 0 },
          { text: "Occasionally — 2 to 3 times", score: 1 },
          { text: "Frequently — 4 to 5 times", score: 2 },
          { text: "Very often — 6 or more times", score: 3 },
        ],
      },
      {
        q: "When you do get sick, how long does recovery typically take?",
        options: [
          { text: "Quick — 2 to 3 days", score: 0 },
          { text: "About a week — normal duration", score: 1 },
          { text: "1 to 2 weeks — takes a while", score: 2 },
          { text: "Weeks or more — I take very long to recover", score: 3 },
        ],
      },
      {
        q: "How would you describe your exposure to stress on a typical week?",
        sub: "Stress is one of the strongest suppressors of immune function.",
        options: [
          { text: "Low — I manage stress well", score: 0 },
          { text: "Moderate — typical life stress", score: 1 },
          { text: "High — I feel stressed most days", score: 2 },
          { text: "Very high — chronic, ongoing stress", score: 3 },
        ],
      },
      {
        q: "How many servings of fruits and vegetables do you eat daily?",
        sub: "A serving = 1 cup of leafy greens or ½ cup of other vegetables/fruit.",
        options: [
          { text: "5 or more servings", score: 0 },
          { text: "3 to 4 servings", score: 1 },
          { text: "1 to 2 servings", score: 2 },
          { text: "Less than 1 serving — I struggle to eat vegetables", score: 3 },
        ],
      },
      {
        q: "Do you experience frequent allergic reactions, skin irritations, or sensitivities?",
        options: [
          { text: "Rarely — I don't have notable sensitivities", score: 0 },
          { text: "Mild and occasional", score: 1 },
          { text: "Moderate — a few times a month", score: 2 },
          { text: "Frequent — it regularly disrupts my life", score: 3 },
        ],
      },
    ],
    tiers: {
      good: {
        label: "✅ Healthy Immune Profile",
        summary: "Your immune system appears to be in good shape. Your responses reflect a healthy lifestyle that supports natural defense.",
        insights: [
          { text: "<strong>Quick recovery times</strong> and low frequency of illness suggest your immune response is robust and well-supported." },
          { text: "<strong>Good vegetable intake</strong> provides antioxidants and phytonutrients that directly fuel immune cell activity." },
          { text: "<strong>Stress management</strong> is a key pillar — continued stress resilience will protect your immune function long-term." },
        ],
        products: [
          { name: "Proflavanol® C100", why: "Grape-seed extract + Vitamin C to <em>support antioxidant defense and healthy immune response</em>.", icon: "shield" },
          { name: "USANA CellSentials®", why: "<em>Comprehensive micronutrient support</em> including zinc and vitamins C, D, and E — key nutrients for immune cell function.", icon: "cell" },
        ],
        tips: [
          { icon: "🥦", text: "Eat a rainbow of vegetables daily — different colors provide different immune-supporting phytonutrients." },
          { icon: "😴", text: "Protect your sleep — immune cells regenerate primarily during deep sleep." },
          { icon: "🧘", text: "Maintain your stress practices; cortisol is one of the most potent suppressors of immune function." },
          { icon: "🚶", text: "Moderate exercise (30 min most days) is one of the best-studied immune supporters." },
        ],
      },
      mid: {
        label: "⚠️ Moderate Immune Support Needed",
        summary: "Your immune system is functional but may benefit from additional nutritional support to strengthen its natural defenses.",
        insights: [
          { text: "<strong>Moderate illness frequency</strong> or slower recovery may reflect nutritional gaps in key immune nutrients like zinc, vitamin C, and vitamin D." },
          { text: "<strong>Stress levels</strong> you reported can directly suppress T-cell and NK cell activity — the frontline soldiers of your immune system." },
          { text: "<strong>Fruit and vegetable intake</strong> below 5 servings per day reduces dietary antioxidants that protect immune cells from oxidative stress." },
        ],
        products: [
          { name: "Proglucamune®", why: "Beta-1,3/1,6-glucans + zinc to <em>support innate immune response and healthy immune cell activation</em>.", icon: "shield" },
          { name: "Proflavanol® C100", why: "Potent antioxidant combination that <em>supports immune defense at the cellular level</em>.", icon: "antioxidant" },
          { name: "USANA CellSentials®", why: "Provides essential vitamins C, D, E, and zinc — <em>critical micronutrients for immune system support</em>.", icon: "cell" },
        ],
        tips: [
          { icon: "🌞", text: "Get 15–20 minutes of daily sun exposure — vitamin D deficiency is strongly linked to impaired immunity." },
          { icon: "🧄", text: "Add garlic, ginger, and turmeric to meals — potent natural immune-supporting compounds." },
          { icon: "😌", text: "Practice one stress-reduction activity daily, even 5 minutes of deep breathing." },
          { icon: "🚿", text: "Maintain regular handwashing and reduce unnecessary pathogen exposure during high-stress periods." },
        ],
      },
      low: {
        label: "🔴 Immune Support Strongly Recommended",
        summary: "Your responses suggest your immune system may benefit from significant nutritional and lifestyle support.",
        insights: [
          { text: "<strong>Frequent illness and slow recovery</strong> together are meaningful signals that your body's defense systems may need comprehensive support." },
          { text: "<strong>High stress + low vegetable intake</strong> is one of the most common combinations that weakens immune resilience over time." },
          { text: "<strong>Frequent sensitivities or reactions</strong> may indicate immune dysregulation that nutrition and lifestyle can help address." },
        ],
        products: [
          { name: "Proglucamune®", why: "<em>Supports innate immune response</em> through clinically studied beta-glucans — the most targeted USANA immune product.", icon: "shield" },
          { name: "USANA HealthPak™", why: "Comprehensive daily nutrition with vitamins C, D, E, zinc, and antioxidants — <em>a full-spectrum immune foundation</em>.", icon: "pack" },
          { name: "Proflavanol® C100", why: "Advanced antioxidant support to <em>protect immune cells from oxidative damage</em> during periods of high immune activity.", icon: "antioxidant" },
        ],
        tips: [
          { icon: "🩺", text: "Consult your doctor if you are getting sick very frequently — there may be underlying factors to investigate." },
          { icon: "🥗", text: "Commit to 5+ servings of fruits and vegetables this week — batch cook vegetables to make it easy." },
          { icon: "💤", text: "Sleep is non-negotiable for immune recovery. Aim for 8 hours, in a dark, cool room." },
          { icon: "🧘", text: "Begin a simple stress-reduction practice today — yoga, prayer, journaling, or a 10-minute walk in nature." },
        ],
      },
    },
  },
  {
    id: "gut",
    icon: "🌿",
    name: "Gut Health Tracker",
    desc: "Explore your digestive wellness — the foundation of nutrient absorption and overall vitality.",
    color: "#1e6e40",
    questions: [
      {
        q: "How often do you experience bloating, gas, or abdominal discomfort?",
        options: [
          { text: "Rarely — my digestion is comfortable", score: 0 },
          { text: "Occasionally — once or twice a week", score: 1 },
          { text: "Often — several times a week", score: 2 },
          { text: "Almost daily — it's a constant issue", score: 3 },
        ],
      },
      {
        q: "How would you describe your bowel regularity?",
        options: [
          { text: "Regular — 1 to 2 times per day, comfortable", score: 0 },
          { text: "Mostly regular, occasional variations", score: 1 },
          { text: "Irregular — constipation or loose stools are common", score: 2 },
          { text: "Very irregular or unpredictable", score: 3 },
        ],
      },
      {
        q: "How often do you eat fermented or probiotic-rich foods?",
        sub: "Examples: yogurt, kefir, kimchi, sauerkraut, tempeh, kombucha.",
        options: [
          { text: "Daily or almost daily", score: 0 },
          { text: "A few times a week", score: 1 },
          { text: "Rarely — once a week or less", score: 2 },
          { text: "Almost never", score: 3 },
        ],
      },
      {
        q: "Do you experience food intolerances, sensitivities, or reactions after eating?",
        options: [
          { text: "No — I can eat most foods without issue", score: 0 },
          { text: "Mild reactions to a few specific foods", score: 1 },
          { text: "Moderate — I avoid several food groups", score: 2 },
          { text: "Significant — many foods cause noticeable reactions", score: 3 },
        ],
      },
      {
        q: "Have you taken antibiotics in the past 12 months?",
        sub: "Antibiotics can significantly disrupt the gut microbiome balance.",
        options: [
          { text: "No, I haven't taken antibiotics recently", score: 0 },
          { text: "Once — short course", score: 1 },
          { text: "Twice or more", score: 2 },
          { text: "Multiple courses — I take antibiotics fairly often", score: 3 },
        ],
      },
    ],
    tiers: {
      good: {
        label: "✅ Healthy Gut Profile",
        summary: "Your digestive health looks good! Your responses suggest a well-functioning gut microbiome and digestive system.",
        insights: [
          { text: "<strong>Regular digestion and minimal bloating</strong> suggest a balanced gut microbiome supporting efficient nutrient absorption." },
          { text: "<strong>Good dietary diversity and probiotic intake</strong> are the strongest predictors of long-term digestive health." },
          { text: "<strong>Minimal food sensitivities</strong> reflect a healthy gut lining and well-calibrated immune response in the digestive tract." },
        ],
        products: [
          { name: "USANA CellSentials®", why: "Provides key micronutrients that <em>support healthy cell function throughout the digestive tract</em>.", icon: "cell" },
          { name: "Hepasil DTX™", why: "Supports <em>healthy liver detoxification</em> — the liver works closely with the gut in processing nutrients and clearing waste.", icon: "liver" },
        ],
        tips: [
          { icon: "🥗", text: "Continue eating diverse, high-fiber foods. Aim for 30 different plant foods per week for microbiome diversity." },
          { icon: "🦠", text: "Rotate your probiotic sources — different fermented foods feed different beneficial bacteria strains." },
          { icon: "💧", text: "Stay hydrated — water is essential for smooth digestive transit and gut lining health." },
          { icon: "🏃", text: "Regular movement directly stimulates healthy gut motility and microbiome diversity." },
        ],
      },
      mid: {
        label: "⚠️ Moderate Gut Concerns",
        summary: "Your gut may benefit from additional support. Some common digestive challenges are showing up in your responses.",
        insights: [
          { text: "<strong>Occasional bloating or irregularity</strong> may reflect imbalances in your gut microbiome or insufficient digestive enzyme activity." },
          { text: "<strong>Low probiotic food intake</strong> reduces the beneficial bacteria that regulate digestion, immunity, and even mood." },
          { text: "<strong>Mild food sensitivities</strong> can indicate some degree of gut lining stress that nutrition can help support." },
        ],
        products: [
          { name: "Hepasil DTX™", why: "Supports <em>liver and digestive health</em>, helping your body process and clear what the gut passes along.", icon: "liver" },
          { name: "USANA CellSentials®", why: "Vitamins and minerals <em>support the integrity of the gut lining</em> and healthy nutrient absorption.", icon: "cell" },
          { name: "BiOmega™", why: "Omega-3s have been shown to <em>support healthy gut microbiome diversity and reduce intestinal inflammation markers</em>.", icon: "omega" },
        ],
        tips: [
          { icon: "🍌", text: "Add prebiotic foods (garlic, onion, banana, oats) to feed your beneficial gut bacteria." },
          { icon: "🫙", text: "Introduce one probiotic food this week — even a small daily serving of yogurt makes a difference." },
          { icon: "🍽️", text: "Eat slowly and chew thoroughly — digestion begins in the mouth, not the stomach." },
          { icon: "😤", text: "Manage stress — the gut-brain axis means stress directly disrupts digestive function." },
        ],
      },
      low: {
        label: "🔴 Gut Health Needs Attention",
        summary: "Your responses suggest your gut may be under significant stress. Digestive health is foundational to all other wellness — addressing it matters.",
        insights: [
          { text: "<strong>Frequent digestive discomfort</strong> is a signal your microbiome, gut lining, or digestive enzyme activity may need meaningful support." },
          { text: "<strong>Irregular bowel function</strong> affects nutrient absorption — even excellent supplements work poorly if the gut isn't absorbing them well." },
          { text: "<strong>Antibiotic use and multiple food sensitivities</strong> together are strong indicators of microbiome disruption that can be supported nutritionally." },
        ],
        products: [
          { name: "Hepasil DTX™", why: "Supports <em>liver and digestive detoxification</em> — helping reduce the burden on a stressed digestive system.", icon: "liver" },
          { name: "USANA CellSentials®", why: "<em>Replenishes key micronutrients</em> that support gut lining integrity and healthy digestive cell function.", icon: "cell" },
          { name: "BiOmega™", why: "Omega-3 fatty acids <em>support gut lining health and a balanced intestinal inflammatory response</em>.", icon: "omega" },
        ],
        tips: [
          { icon: "🩺", text: "Speak with a gastroenterologist if digestive symptoms are severe or persistent — some conditions need medical guidance." },
          { icon: "🥩", text: "Try an elimination diet (remove gluten and dairy for 2 weeks) to identify trigger foods." },
          { icon: "🫁", text: "Deep belly breathing before meals activates the parasympathetic nervous system — essential for optimal digestion." },
          { icon: "🚫", text: "Reduce ultra-processed foods — artificial emulsifiers directly disrupt the gut microbiome barrier." },
        ],
      },
    },
  },
  {
    id: "sleep",
    icon: "🌙",
    name: "Stress & Sleep Tracker",
    desc: "Evaluate your stress load and sleep quality — two of the most powerful drivers of long-term health.",
    color: "#1a2060",
    questions: [
      {
        q: "How would you rate your average daily stress level?",
        sub: "Consider all sources: work, family, finances, health.",
        options: [
          { text: "Low — I feel generally calm and in control", score: 0 },
          { text: "Moderate — manageable everyday stress", score: 1 },
          { text: "High — I feel stressed most of the day", score: 2 },
          { text: "Very high — stress feels uncontrollable and overwhelming", score: 3 },
        ],
      },
      {
        q: "How long does it typically take you to fall asleep after getting into bed?",
        options: [
          { text: "Under 15 minutes — I fall asleep easily", score: 0 },
          { text: "15 to 30 minutes", score: 1 },
          { text: "30 to 60 minutes", score: 2 },
          { text: "Over an hour — I struggle to fall asleep", score: 3 },
        ],
      },
      {
        q: "How often do you wake up during the night and have trouble going back to sleep?",
        options: [
          { text: "Rarely — I sleep through most nights", score: 0 },
          { text: "Once or twice a week", score: 1 },
          { text: "3 to 4 nights per week", score: 2 },
          { text: "Almost every night", score: 3 },
        ],
      },
      {
        q: "Do you experience physical tension — tight shoulders, jaw clenching, headaches — related to stress?",
        options: [
          { text: "No — my body feels relaxed most of the time", score: 0 },
          { text: "Occasionally after a stressful day", score: 1 },
          { text: "Often — physical tension is a regular companion", score: 2 },
          { text: "Almost always — my body carries tension constantly", score: 3 },
        ],
      },
      {
        q: "How do you feel emotionally on most days?",
        options: [
          { text: "Generally positive and balanced", score: 0 },
          { text: "Mostly okay — occasional low periods", score: 1 },
          { text: "Frequently anxious, irritable, or overwhelmed", score: 2 },
          { text: "Persistently stressed, anxious, or emotionally depleted", score: 3 },
        ],
      },
    ],
    tiers: {
      good: {
        label: "✅ Healthy Stress & Sleep Balance",
        summary: "Your stress and sleep responses look balanced. You appear to have strong recovery and emotional resilience.",
        insights: [
          { text: "<strong>Good sleep onset and maintenance</strong> are the strongest indicators of a healthy stress response and nervous system balance." },
          { text: "<strong>Low physical tension</strong> suggests your body is not carrying excess cortisol — a very positive sign for long-term health." },
          { text: "<strong>Emotional balance</strong> supports every other dimension of wellness — from immune function to energy and digestion." },
        ],
        products: [
          { name: "Pure Rest™", why: "Melatonin supplement to <em>support a natural, consistent sleep-wake cycle</em> — protecting your excellent sleep foundation.", icon: "sleep" },
          { name: "BiOmega™", why: "Omega-3s <em>support healthy mood, emotional resilience, and brain stress response</em>.", icon: "omega" },
        ],
        tips: [
          { icon: "📅", text: "Keep a consistent sleep schedule every day — even weekends. Consistency is the #1 sleep quality driver." },
          { icon: "🧘", text: "Maintain your stress practices. Prevention is far easier than recovery from burnout." },
          { icon: "📵", text: "Protect your sleep environment — dark, cool, and phone-free gives you the deepest rest." },
          { icon: "🎯", text: "Periodic 'stress audits' help you catch rising stress early before it affects sleep or health." },
        ],
      },
      mid: {
        label: "⚠️ Moderate Stress & Sleep Concerns",
        summary: "Some stress and sleep challenges are showing up. Addressing these now can prevent them from deepening over time.",
        insights: [
          { text: "<strong>Moderate sleep difficulties</strong> compound over time — even mild chronic sleep deprivation affects memory, immunity, and metabolic health." },
          { text: "<strong>Physical tension and stress</strong> elevate cortisol, which disrupts sleep architecture, particularly deep restorative sleep." },
          { text: "<strong>Magnesium deficiency</strong> — extremely common — is one of the most overlooked contributors to sleep difficulty and physical stress tension." },
        ],
        products: [
          { name: "Pure Rest™", why: "Melatonin <em>supports a healthy sleep cycle onset</em>, helping you fall asleep naturally and stay asleep longer.", icon: "sleep" },
          { name: "MagneCal D™", why: "Magnesium <em>supports muscle relaxation, nervous system calm, and restorative sleep quality</em>.", icon: "mineral" },
          { name: "BiOmega™", why: "Omega-3s <em>support healthy stress response and emotional balance</em> via brain health.", icon: "omega" },
        ],
        tips: [
          { icon: "📵", text: "Implement a screen-free hour before bed. Blue light suppresses melatonin production significantly." },
          { icon: "🫁", text: "Practice 4-7-8 breathing before sleep: inhale 4 sec, hold 7 sec, exhale 8 sec. Repeat 4 times." },
          { icon: "📝", text: "Write a 'worry dump' journal before bed to offload anxious thoughts from your mind." },
          { icon: "🛁", text: "A warm shower 1–2 hours before bed triggers a natural body temperature drop that induces sleepiness." },
        ],
      },
      low: {
        label: "🔴 High Stress & Poor Sleep — Support Recommended",
        summary: "Your stress and sleep patterns suggest your body and mind are under significant ongoing strain. Nutritional and lifestyle support may help.",
        insights: [
          { text: "<strong>Chronic high stress + poor sleep</strong> is one of the most damaging combinations for long-term health — affecting immunity, heart health, weight, and cognitive function." },
          { text: "<strong>Persistent emotional depletion</strong> is a signal your nervous system needs both nutritional and lifestyle support — not just willpower." },
          { text: "<strong>Physical tension and sleep disruption</strong> together often reflect a dysregulated HPA (stress hormone) axis — nutrition, movement, and sleep hygiene all contribute to restoring balance." },
        ],
        products: [
          { name: "Pure Rest™", why: "Melatonin <em>supports healthy sleep onset</em> — the first step in breaking the stress-sleeplessness cycle.", icon: "sleep" },
          { name: "MagneCal D™", why: "Magnesium <em>supports the nervous system, muscle relaxation, and deeper sleep quality</em> — especially important under high stress.", icon: "mineral" },
          { name: "USANA HealthPak™", why: "Comprehensive daily nutrition to <em>support resilience against stress-related nutritional depletion</em> — B vitamins, antioxidants, and minerals.", icon: "pack" },
        ],
        tips: [
          { icon: "🩺", text: "Please speak with a doctor or mental health professional — chronic stress and sleep deprivation at this level deserve professional attention." },
          { icon: "🏞️", text: "Spend 20 minutes in nature daily — even a quiet park significantly reduces cortisol levels." },
          { icon: "🤝", text: "Share your stress load with a trusted person. Social connection is one of the most powerful stress regulators." },
          { icon: "📋", text: "Simplify your commitments this week — saying no to one thing protects your recovery bandwidth." },
        ],
      },
    },
  },
];

export function getTier(score: number, totalQuestions: number): TierKey {
  const max = totalQuestions * 3;
  const pct = max === 0 ? 0 : score / max;
  if (pct <= 0.33) return "good";
  if (pct <= 0.66) return "mid";
  return "low";
}
