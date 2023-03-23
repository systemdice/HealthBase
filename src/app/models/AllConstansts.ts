export const flags = {
  'NL': "flag-icon flag-icon-nl",
  'BE': "flag-icon flag-icon-be",
  'DE': "flag-icon flag-icon-de",
  'FR': "flag-icon flag-icon-fr",
  'SE': "flag-icon flag-icon-se",
  'ES': "flag-icon flag-icon-es",
};

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'MMM DD, YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
}; 



export const DoctorDepartment = [
  { name: 'General', desc: 'Genral subjects.' },  
  { name: 'Other', desc: 'Having no specific category' },
  { name: 'Nursing', desc: 'Specific to nursing' },  
  { name: 'Allergists/Immunologists', desc: 'They treat immune system disorders such as asthma, eczema, food allergies, insect sting allergies, and some autoimmune diseases.' },
  { name: 'Anesthesiologists', desc: 'These doctors give you drugs to numb your pain or to put you under during surgery, childbirth, or other procedures. They monitor your vital signs while you’re under anesthesia.' },
  { name: 'Cardiologists', desc: 'They’re experts on the heart and blood vessels. You might see them for heart failure, a heart attack, high blood pressure, or an irregular heartbeat.' },
  { name: 'Colon and Rectal Surgeons', desc: 'You would see these doctors for problems with your small intestine, colon, and bottom. They can treat colon cancer, hemorrhoids, and inflammatory bowel disease.' },
  { name: 'Critical Care Medicine Specialists', desc: 'They care for people who are critically ill or injured, often heading intensive care units in hospitals. You might see them if your heart or other organs are failing or if you’ve been in an accident. ' },
  { name: 'Dermatologists', desc: 'Have problems with your skin, hair, nails? Do you have moles, scars, acne, or skin allergies? Dermatologists can help.' },
  { name: 'Endocrinologists', desc: 'These are experts on hormones and metabolism. They can treat conditions like diabetes, thyroid problems, infertility, and calcium and bone disorders.' },
  { name: 'Emergency Medicine Specialists', desc: 'These doctors make life-or-death decisions for sick and injured people, usually in an emergency room. Their job is to save lives and to avoid or lower the chances of disability.' },
  { name: 'Family Physicians', desc: 'They care for the whole family, including children, adults, and the elderly. They do routine checkups and screening tests, give you flu and immunization shots, and manage diabetes and other ongoing medical conditions.' },
  { name: 'Gastroenterologists', 'desc': 'They’re specialists in digestive organs, including the stomach, bowels, pancreas, liver, and gallbladder. You might see them for abdominal pain, ulcers, diarrhea, jaundice, or cancers in your digestive organs. They also do a colonoscopy and other tests for colon cancer' },
  { name: 'Hematologists', desc: 'These are specialists in diseases of the blood, spleen, and lymph glands, like sickle cell disease, anemia, hemophilia, and leukemia.' },
  { name: 'Neurologists', desc: 'These are specialists in the nervous system, which includes the brain, spinal cord, and nerves. They treat strokes, brain and spinal tumors, epilepsy, Parkinson\'s disease, and Alzheimers disease.' },
  { name: 'Pathologists', desc: 'These lab doctors identify the causes of diseases by examining body tissues and fluids under microscopes.' },
  { name: 'Pediatricians', desc: 'They care for children from birth to young adulthood. Some pediatricians specialize in pre-teens and teens, child abuse, or children\'s developmental issues.' },
  { name: 'Pulmonologists', desc: 'You would see these specialists for problems like lung cancer, pneumonia, asthma, emphysema, and trouble sleeping caused by breathing issues.' },
  { name: 'Radiologists', desc: 'They use X-rays, ultrasound, and other imaging tests to diagnose diseases. They can also specialize in radiation oncology to treat conditions like cancer.' },
  { name: 'Rheumatologists', desc: 'They specialize in arthritis and other diseases in your joints, muscles, bones, and tendons. You might see them for your osteoporosis (weak bones), back pain, gout, tendinitis from sports or repetitive injuries, and fibromyalgia.' },
  { name: 'Medicine Specialists', desc: 'They find and treat causes behind your poor sleep. They may have sleep labs or give you take-home tests to chart your sleep-wake patterns.' },
  { name: 'General Surgeons', desc: 'These doctors can operate on all parts of your body. They can take out tumors, appendices, or gallbladders and repair hernias. Many surgeons have subspecialties, like cancer, hand, or vascular surgery.' }

];

export const StaffType = [
  { name: 'Doctor', desc: 'They treat immune system disorders such as asthma, eczema, food allergies, insect sting allergies, and some autoimmune diseases.' },
  { name: 'Nurse', desc: 'These doctors give you drugs to numb your pain or to put you under during surgery, childbirth, or other procedures. They monitor your vital signs while you’re under anesthesia.' },
  { name: 'LaboratoryAsst', desc: 'They’re experts on the heart and blood vessels. You might see them for heart failure, a heart attack, high blood pressure, or an irregular heartbeat.' },
  { name: 'Pathologist', desc: 'You would see these doctors for problems with your small intestine, colon, and bottom. They can treat colon cancer, hemorrhoids, and inflammatory bowel disease.' },
  { name: 'OTTechnician', desc: 'They care for people who are critically ill or injured, often heading intensive care units in hospitals. You might see them if your heart or other organs are failing or if you’ve been in an accident. ' },
  { name: 'Helper', desc: 'Have problems with your skin, hair, nails? Do you have moles, scars, acne, or skin allergies? Dermatologists can help.' },
  { name: 'DataWriter', desc: 'These are experts on hormones and metabolism. They can treat conditions like diabetes, thyroid problems, infertility, and calcium and bone disorders.' },
  { name: 'Anasthetic', desc: 'They treat immune system disorders such as asthma, eczema, food allergies, insect sting allergies, and some autoimmune diseases.' },
  
];

export const labels = {
  "ILB": "Athlon Car Lease",
  "DAL": "Belfius Auto Lease NV",
  "C4P": "Cars4Publicity BVBA",
  "LUX": "Athlon Car Lease Lux",
  "ACL": "Athlon Car Lease",
  "WPL": "Wagenplan",
}

export const APIDetails = {
  //'HelathAPI':"https://localhost:5001"  
  'HelathAPI':"http://45.34.15.113:9014"
  //'HelathAPI': "http://45.34.15.113:9002" 
};

export const GenericInformations = {
  "address1": "Truesmile, SahidNagar",
  "address2": "Bhubaneswar, Odisha",
  "address3": "(080) 3452676)",
  "hospitalname": "True Smile",
  "PhoneNumber": "0878765"
}

export interface gender {
  id: string;
  name: string;
}

export interface Paramters {
  Order: number;
  Name: string;
  Unit: string;
  InputType: string;
  Optional: boolean;
  Removed: boolean;
}
export interface DoctorAvail{
  name:string;
  availability:any[];
}

export const DoctorAvailabilityCalander = [
  {
    "name": "avina",
    "availability": [
      {title: 'Conference1Av', start: '2020-12-17', end: '2020-12-18'},
      {title: 'MeetingAv', start: '2020-11-09T10:30:10', end: '2020-11-09T12:30:00'},
      { title: 'Avail(S)', date: '2020-12-11' },
      { title: 'Avail', date: '2020-12-02' },
      { title: 'Avail(Lim)', date: '2020-12-03' },
      { title: 'Available', date: '2020-12-05' }
    ]
  },
  {
    "name": "ashirbad",
    "availability": [
      {title: 'Conference1As', start: '2020-12-18', end: '2020-12-19'},
      {title: 'MeetingAs', start: '2020-12-09T10:30:10', end: '2020-12-09T11:30:00'},
      {title: 'MeetingAs', start: '2020-12-09T11:45:10', end: '2020-12-09T12:30:00'},
      { title: 'Avail(S)', date: '2020-12-12' },
      { title: 'Avail', date: '2020-12-04' },
      { title: 'Avail(Lim)', date: '2020-12-03' },
      { title: 'Available', date: '2020-12-06' }
    ]
  }

]
