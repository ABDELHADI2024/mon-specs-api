const request = require("request-promise");
const cheerio = require("cheerio");
const { json, errorJson } = require("../../utils/response");

// Dictionnaire pour l'amélioration 10x : Traduction immédiate des catégories
const arabicTitles = {
    "Network": "الشبكة والاتصال",
    "Launch": "تاريخ الإصدار",
    "Body": "التصميم والهيكل",
    "Display": "الشاشة",
    "Platform": "الأداء والنظام",
    "Memory": "الذاكرة والتخزين",
    "Main Camera": "الكاميرا الخلفية",
    "Selfie camera": "كاميرا السيلفي",
    "Sound": "الصوت",
    "Battery": "البطارية والشحن",
    "Features": "مميزات إضافية",
    "Misc": "معلومات متنوعة"
};

const scrapeSpecs = async (url) => {
    try {
        const htmlResult = await request.get(url);
        let $ = await cheerio.load(htmlResult);
        
        const phone_full_title = $("h1.specs-phone-name-title").text();
        if (!phone_full_title) throw new Error("Invalid url!");

        const brand = phone_full_title.split(" ")[0];
        const phone_name = phone_full_title.split(brand)[1].trim();
        const thumbnail = $(".specs-photo-main img").attr("src");

        let specifications = [];
        const features = ["Network", "Launch", "Body", "Display", "Platform", "Memory", "Main Camera", "Selfie camera", "Sound", "Comms", "Features", "Battery", "Misc"];

        features.forEach((feature) => {
            let section = {
                title_en: feature,
                title_ar: arabicTitles[feature] || feature,
                specs: []
            };

            let table = $('th:contains("' + feature + '")').closest('table');
            if (table.length) {
                table.find('tr').each((i, tr) => {
                    let key = $(tr).find('td.ttl').text().trim();
                    let val = $(tr).find('td.nfo').text().trim();
                    if (key || val) {
                        section.specs.push({ key, val: [val] });
                    }
                });
                specifications.push(section);
            }
        });

        // Amélioration Stratégique : Données pour le marché Arabe
        return {
            brand,
            phone_name,
            thumbnail,
            release_date: $('.icon-launched').next().text().trim(),
            os: $('.icon-os').next().text().trim(),
            storage: $('.icon-sd-card-0').next().text().trim(),
            // Emplacements pour tes futurs éléments différenciateurs
            market_data: {
                local_price: "قريباً",
                resale_value_score: 0, // Sera rempli par ton algo
                heat_resistance_score: 0, // Sera rempli par les votes
                currency: "SAR/MAD/EGP"
            },
            specifications
        };
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.index = async (req, res) => {
    try {
        const baseUrl = `${process.env.BASE_URL}`;
        const slug = req.params.slug;
        const url = `${baseUrl}/${slug}.php`;

        const response = await scrapeSpecs(url);
        return json(res, response);
    } catch (error) {
        return errorJson(res, 'Please provide a valid phone slug!');
    }
};
