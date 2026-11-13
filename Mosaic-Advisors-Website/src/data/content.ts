// საიტის კონტენტი. ტექსტის შესაცვლელად დაარედაქტირეთ ეს ფაილი — კომპონენტებში ცვლილება საჭირო არ არის.
import type { Loc } from "../i18n";

export type IconName = "i-calc" | "i-legal" | "i-chart";
export type Slide = Loc<[eyebrow: string, title: string, text: string]> & { c: [string, string] };
export type Service = { id: "accounting" | "legal" | "audit"; ic: IconName } & Loc<{ t: string; d: string; li: string[]; items: [string, string][] }>;
export type PackageId = "foundation" | "growth" | "strategy";
export type Pkg = { id: PackageId; price: string; per: "once" | "mo"; feat?: boolean } & Loc<{ tag: string; n: string; d: string; li: string[] }>;
export type PostBlock = ["p" | "h" | "n", string] | ["ul", string[]];
export type Post = { id: string; date: string; mins: number; c: [string, string] } & Loc<{ cat: string; t: string; ex: string; body: PostBlock[] }>;
export type Pair = [string, string];

export const SLIDES: Slide[] = [
 {ka:["ბუღალტერია და გადასახადები","ბუღალტერია და გადასახადები — სიზუსტით","ყოველდღიური აღრიცხვა, ყოველთვიური დეკლარაციები და ERP მხარდაჭერა — თქვენ კი ბიზნესზე იზრუნეთ."],
  en:["Accounting & tax","Accounting and tax, handled with precision","Daily bookkeeping, monthly declarations and ERP support — so you can focus on the business."], c:["#0f2238","#1d3d61"]},
 {ka:["იურიდიული მხარდაჭერა","კომპანიის რეგისტრაცია და იურიდიული მხარდაჭერა","საჯარო რეესტრში რეგისტრაციიდან ხელშეკრულებებამდე და კორპორაციულ დოკუმენტებამდე."],
  en:["Legal support","Company registration and legal support","From Public Registry filing to contracts and corporate documents."], c:["#13263b","#2b3f57"]},
 {ka:["აუდიტი და სტრატეგია","აუდიტი, IFRS და სტრატეგიული კონსულტაცია","შიდა აუდიტი, IFRS ანგარიშგება და ფინანსური მოდელები ზრდის გადაწყვეტილებებისთვის."],
  en:["Audit & strategy","Audit, IFRS and strategic consulting","Internal audit, IFRS reporting and financial models that support growth decisions."], c:["#0c1d30","#24405e"]}
];

export const SERVICES: Service[] = [
 {id:"accounting", ic:"i-calc",
  ka:{t:"საბუღალტრო და საგადასახადო მომსახურება", d:"სრული ბუღალტრული აღრიცხვა და დეკლარირება — დროულად და შეცდომების გარეშე.", li:["ყოველდღიური ბუღალტერია","საგადასახადო დეკლარაციები","ERP სისტემების მხარდაჭერა"],
   items:[["ბუღალტრული აღრიცხვა","პირველადი დოკუმენტების დამუშავება, ბანკის შეჯერება, ძირითადი საშუალებები."],["საგადასახადო დეკლარაციები","დღგ, საშემოსავლო, მოგების და ქონების გადასახადი rs.ge-ზე."],["ხელფასები","სახელფასო უწყისები, საპენსიო შენატანები და ანგარიშგება."],["ERP და ღრუბლოვანი აღრიცხვა","Oris, Balance, 1C და სხვა სისტემების დანერგვა და მხარდაჭერა."]]},
  en:{t:"Accounting & tax services", d:"Complete bookkeeping and filing — on time and error-free.", li:["Daily bookkeeping","Tax returns","ERP system support"],
   items:[["Bookkeeping","Source document processing, bank reconciliation, fixed assets."],["Tax returns","VAT, income, profit and property tax filed via rs.ge."],["Payroll","Payroll sheets, pension contributions and reporting."],["ERP & cloud accounting","Setup and support for Oris, Balance, 1C and other systems."]]}},
 {id:"legal", ic:"i-legal",
  ka:{t:"კომპანიის რეგისტრაცია და იურიდიული მხარდაჭერა", d:"ბიზნესის დაწყება და იურიდიული უსაფრთხოება ერთ სივრცეში.", li:["კომპანიის რეგისტრაცია","დოკუმენტაცია","იურიდიული ხელშეკრულებები"],
   items:[["კომპანიის რეგისტრაცია","შპს, სს, ი/მ და ფილიალების რეგისტრაცია საჯარო რეესტრში."],["კორპორაციული დოკუმენტები","წესდება, პარტნიორთა გადაწყვეტილებები, ცვლილებები."],["ხელშეკრულებები","შრომითი, მომსახურების, იჯარის და მიწოდების ხელშეკრულებები."],["უცხოელი ინვესტორები","ბინადრობა, საბანკო ანგარიში და ადგილობრივი წარმომადგენლობა."]]},
  en:{t:"Company registration & legal support", d:"Starting a business and staying legally safe, in one place.", li:["Company registration","Documentation","Legal contracts"],
   items:[["Company registration","LLC, JSC, sole entrepreneur and branch registration at the Public Registry."],["Corporate documents","Charters, partner resolutions and amendments."],["Contracts","Employment, service, lease and supply agreements."],["Foreign investors","Residency, bank accounts and local representation."]]}},
 {id:"audit", ic:"i-chart",
  ka:{t:"აუდიტი, IFRS და სტრატეგიული კონსულტაცია", d:"ანგარიშგება, რომელსაც ბანკი და ინვესტორი ენდობა.", li:["შიდა აუდიტი","სტანდარტების დანერგვა","ფინანსური მოდელირება"],
   items:[["შიდა აუდიტი","პროცესების, კონტროლების და რისკების შეფასება."],["IFRS ანგარიშგება","ფინანსური ანგარიშგება IFRS / IFRS for SMEs-ის მიხედვით და ატვირთვა reportal.ge-ზე."],["ფინანსური მოდელირება","ბიუჯეტი, ფულადი ნაკადები, ინვესტიციის შეფასება."],["M&A და ოპტიმიზაცია","Due diligence, რესტრუქტურიზაცია და საგადასახადო დაგეგმვა."]]},
  en:{t:"Audit, IFRS & strategic consulting", d:"Reporting that banks and investors trust.", li:["Internal audit","Standards implementation","Financial modeling"],
   items:[["Internal audit","Review of processes, controls and risk."],["IFRS reporting","Financial statements under IFRS / IFRS for SMEs, filed on reportal.ge."],["Financial modeling","Budgets, cash-flow forecasts, investment appraisal."],["M&A & optimization","Due diligence, restructuring and tax planning."]]}}
];

export const PACKAGES: Pkg[] = [
 {id:"foundation", price:"250", per:"once",
  ka:{tag:"სტარტი", n:"საფუძველი", d:"ახალი ბიზნესისთვის, რომელიც სწორად უნდა დაიწყოს.", li:["კომპანიის რეგისტრაცია","საგადასახადო რეგისტრაცია და კოდი","საბაზისო იურიდიული დოკუმენტები","უფასო 15-წუთიანი კონსულტაცია ექსპერტთან"]},
  en:{tag:"Starter", n:"Foundation", d:"For new businesses that want to start right.", li:["Company registration","Tax registration & code","Core legal documents","Free 15-minute expert consultation"]}},
 {id:"growth", price:"600", per:"mo", feat:true,
  ka:{tag:"შესაბამისობა", n:"ზრდა", d:"მოქმედი კომპანიებისთვის ყოველთვიური აღრიცხვით.", li:["ყოველთვიური ბუღალტერია","დღგ, საშემოსავლო და მოგების დეკლარაციები","ხელფასები და საპენსიო","ERP და ღრუბლოვანი აღრიცხვის მხარდაჭერა"]},
  en:{tag:"Compliance", n:"Growth", d:"For operating companies that need monthly bookkeeping.", li:["Monthly bookkeeping","VAT, income & profit tax returns","Payroll & pension contributions","ERP and cloud accounting support"]}},
 {id:"strategy", price:"1 500", per:"mo",
  ka:{tag:"აღმასრულებელი", n:"სტრატეგია", d:"მზარდი კომპანიებისთვის, რომლებსაც ინვესტორები ჰყავთ.", li:["სრული აუდიტისთვის მომზადება","IFRS ფინანსური ანგარიშგება","შიდა კონტროლის სისტემა","სკალირების, M&A და საგადასახადო ოპტიმიზაციის კონსულტაცია"]},
  en:{tag:"Executive", n:"Strategy", d:"For scaling companies with investors to report to.", li:["Full audit preparation","IFRS financial reporting","Internal control framework","Advice on scaling, M&A and tax optimization"]}}
];

export const POSTS: Post[] = [
 {id:"documents", date:"2026-10-02", mins:5, c:["#0f2238","#c49a52"],
  ka:{cat:"აღრიცხვა", t:"ბუღალტრული დოკუმენტაციის შენახვა და შიდა კონტროლი საქართველოში", ex:"რა უნდა შეინახოთ, რამდენ ხანს და როგორ ააწყოთ მარტივი შიდა კონტროლი.",
   body:[["p","ბუღალტრული დოკუმენტაცია არ არის მხოლოდ საგადასახადო ვალდებულება — ის თქვენი ბიზნესის მეხსიერებაა. სწორად შენახული დოკუმენტები გიცავთ შემოწმებისას და ამარტივებს ბანკთან ან ინვესტორთან ურთიერთობას."],["h","რა უნდა ინახებოდეს"],["ul",["ანგარიშ-ფაქტურები და მიღება-ჩაბარების აქტები","საბანკო ამონაწერები და გადახდის დავალებები","ხელშეკრულებები და მათი ცვლილებები","სახელფასო უწყისები და შრომითი ხელშეკრულებები"]],["h","რამდენ ხანს"],["p","შენახვის ვადებს საგადასახადო კოდექსი და ბუღალტრული აღრიცხვის შესახებ კანონი განსაზღვრავს და ისინი რამდენიმე წელს მოიცავს. ვადები დროდადრო იცვლება, ამიტომ თქვენს შემთხვევაზე ყოველთვის გადაამოწმეთ მოქმედი რედაქცია."],["h","მარტივი შიდა კონტროლი"],["p","გამოყავით ფუნქციები: ვინც გადახდას ამზადებს, ის არ უნდა ადასტურებდეს. ბანკის შეჯერება გააკეთეთ ყოველთვიურად, ხოლო ელექტრონული ასლები შეინახეთ სარეზერვო ღრუბლოვან სივრცეში."],["n","ეს სტატია ზოგადი ინფორმაციაა და არ წარმოადგენს პროფესიულ რჩევას."]]},
  en:{cat:"Accounting", t:"Storing accounting records and internal controls in Georgia", ex:"What to keep, for how long, and how to set up simple internal controls.",
   body:[["p","Accounting records aren't just a tax obligation — they're your business's memory. Well-kept records protect you during an audit and make dealing with banks or investors much easier."],["h","What to keep"],["ul",["Invoices and acceptance certificates","Bank statements and payment orders","Contracts and their amendments","Payroll sheets and employment contracts"]],["h","For how long"],["p","Retention periods are set by the Tax Code and the Law on Accounting, Reporting and Auditing, and they run for several years. The rules change from time to time, so always check the current wording for your case."],["h","Simple internal controls"],["p","Separate duties: whoever prepares a payment shouldn't approve it. Reconcile bank accounts monthly, and keep electronic copies backed up in the cloud."],["n","This article is general information, not professional advice."]]}},
 {id:"vat", date:"2026-09-18", mins:6, c:["#16304d","#e2c38b"],
  ka:{cat:"გადასახადები", t:"დღგ-ის წესები და სტრატეგია ქართულ ბუღალტერიაში", ex:"როდის ხდება რეგისტრაცია სავალდებულო და როგორ მართოთ ჩათვლები.",
   body:[["p","დამატებული ღირებულების გადასახადი საქართველოში ერთ-ერთი ყველაზე მნიშვნელოვანი გადასახადია, ხოლო შეცდომები მასში ხშირად ჯარიმებით მთავრდება."],["h","როდის არის რეგისტრაცია სავალდებულო"],["p","სტანდარტული განაკვეთი 18%-ია. რეგისტრაცია სავალდებულოა, როცა ნებისმიერი უწყვეტი 12 თვის დასაბეგრი ბრუნვა 100 000 ლარს აღემატება. ნებაყოფლობითი რეგისტრაციაც შესაძლებელია."],["h","ჩათვლების მართვა"],["ul",["შეამოწმეთ, რომ მომწოდებლის ანგარიშ-ფაქტურა დროულად არის გამოწერილი","შეუსაბამობები გაასწორეთ დეკლარაციის წარდგენამდე","გაითვალისწინეთ ექსპორტისა და გათავისუფლებული ოპერაციების სპეციფიკა"]],["h","სტრატეგია"],["p","მზარდმა ბიზნესმა ზღვარს წინასწარ უნდა ადევნოს თვალი — ზოგჯერ ადრეული ნებაყოფლობითი რეგისტრაცია უფრო ხელსაყრელია ჩათვლების გამო."],["n","განაკვეთები და ზღვრები გადაამოწმეთ rs.ge-ზე — ისინი შეიძლება შეიცვალოს."]]},
  en:{cat:"Tax", t:"VAT rules and strategy in Georgian accounting", ex:"When registration becomes mandatory and how to manage input credits.",
   body:[["p","Value added tax is one of the most important taxes in Georgia, and mistakes with it often end in penalties."],["h","When registration is mandatory"],["p","The standard rate is 18%. Registration becomes mandatory once taxable turnover in any continuous 12-month period exceeds ₾100,000. Voluntary registration is also possible."],["h","Managing input credits"],["ul",["Check that supplier tax invoices are issued on time","Fix mismatches before filing the return","Account for the specifics of exports and exempt supplies"]],["h","Strategy"],["p","A growing business should watch the threshold in advance — sometimes voluntary early registration pays off because of input credits."],["n","Check current rates and thresholds on rs.ge — they can change."]]}},
 {id:"ifrs", date:"2026-08-30", mins:4, c:["#0c1d30","#c49a52"],
  ka:{cat:"IFRS", t:"IFRS-ის მნიშვნელობა საქართველოში", ex:"ვის ეხება ფინანსური ანგარიშგების სტანდარტები და რატომ არის ეს უპირატესობა.",
   body:[["p","2016 წლიდან მოქმედი ბუღალტრული აღრიცხვის, ანგარიშგებისა და აუდიტის შესახებ კანონმა ქართული კომპანიების ანგარიშგება საერთაშორისო სტანდარტებს დაუახლოვა."],["h","ვის ეხება"],["p","საწარმოები ზომის მიხედვით კატეგორიებად იყოფა. მსხვილი და საზოგადოებრივი ინტერესის მქონე საწარმოები სრულ IFRS-ს იყენებენ, საშუალო და მცირე — IFRS for SMEs-ს, ხოლო მიკრო საწარმოებს გამარტივებული მოთხოვნები აქვთ. ანგარიშგება იტვირთება reportal.ge-ზე."],["h","რატომ არის ეს უპირატესობა"],["ul",["ბანკები და ინვესტორები უფრო სწრაფად იღებენ გადაწყვეტილებას","ადვილდება უცხოურ კომპანიებთან შედარება","უმჯობესდება შიდა მართვითი ინფორმაცია"]],["n","კატეგორიის კრიტერიუმები და ვადები გადაამოწმეთ SARAS-ის ოფიციალურ წყაროებში."]]},
  en:{cat:"IFRS", t:"Why IFRS matters in Georgia", ex:"Who the reporting standards apply to and why they're an advantage.",
   body:[["p","The Law on Accounting, Reporting and Auditing, in force since 2016, brought Georgian company reporting closer to international standards."],["h","Who it applies to"],["p","Entities are grouped into categories by size. Large entities and public-interest entities use full IFRS, medium and small ones use IFRS for SMEs, and micro entities have simplified requirements. Reports are filed on reportal.ge."],["h","Why it's an advantage"],["ul",["Banks and investors decide faster","Comparison with foreign companies becomes easier","Internal management information improves"]],["n","Check category criteria and deadlines in SARAS's official sources."]]}}
];

export const STEPS: Loc<Pair[]> = {
 ka:[["უფასო სკანირება","15-წუთიანი ზარი თქვენი ამჟამინდელი მდგომარეობის გასაგებად."],["შეთავაზება","გამჭვირვალე ფასი და სამუშაოს მოცულობა წერილობით."],["ჩართვა","დოკუმენტების გადმოცემა და სისტემებზე წვდომის მოწყობა."],["მუდმივი მხარდაჭერა","ყოველთვიური ანგარიში და პირადი მენეჯერი."]],
 en:[["Free scan","A 15-minute call to understand where you are today."],["Proposal","Transparent pricing and scope of work in writing."],["Onboarding","Document handover and access to your systems."],["Ongoing support","Monthly reporting and a dedicated manager."]]
};

export const TEAM: Loc<Pair[]> = {
 ka:[["ნინო ბერიძე","გენერალური დირექტორი"],["გიორგი ბერიძე","მთავარი ბუღალტერი"],["ანა კაპანაძე","იურისტი"],["ლევან ჩხეიძე","IFRS სპეციალისტი"]],
 en:[["Nino Beridze","General Director"],["Giorgi Beridze","Chief Accountant"],["Ana Kapanadze","Lawyer"],["Levan Chkheidze","IFRS Specialist"]]
};

export const FAQ: Loc<Pair[]> = {
 ka:[["რამდენ ხანში რეგისტრირდება კომპანია?","ჩვეულებრივ 1–2 სამუშაო დღეში, თუ ყველა დოკუმენტი მზადაა."],["შეგიძლიათ არსებული ბუღალტერიის აღება?","დიახ. ჯერ ვაკეთებთ შემოწმებას, ვასწორებთ ხარვეზებს და შემდეგ ვიღებთ ყოველდღიურ აღრიცხვას."],["უცხოელ კლიენტებთან მუშაობთ?","დიახ, ვმუშაობთ ქართულ, ინგლისურ და რუსულ ენებზე."],["როგორ გამოითვლება ფასი?","ფასი დამოკიდებულია ოპერაციების რაოდენობაზე, თანამშრომლებზე და დღგ-ის სტატუსზე. ზუსტ შეთავაზებას უფასო სკანირების შემდეგ მიიღებთ."]],
 en:[["How long does company registration take?","Usually 1–2 working days once all documents are ready."],["Can you take over our existing books?","Yes. We review first, fix any gaps, then take over day-to-day bookkeeping."],["Do you work with foreign clients?","Yes — we work in Georgian, English and Russian."],["How is pricing calculated?","It depends on transaction volume, headcount and VAT status. You'll get an exact quote after the free scan."]]
};

export const CONTACT = {
  phone: "+995 (555) 00 12 34",
  phoneHref: "tel:+995555001234",
  email: "hello@mosaic-advisors.ge",
  social: { facebook: "https://facebook.com", youtube: "https://youtube.com", linkedin: "https://linkedin.com", instagram: "https://instagram.com" }
} as const;
