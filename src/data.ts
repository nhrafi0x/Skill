export interface JobProfile {
  id: string;
  title: string;
  description: string;
  salary: string;
  skills: string[];
  skillBreakdown?: { name: string; level: 'Core' | 'Intermediate' | 'Advanced'; importance: string; resource: { title: string; url: string } }[];
  resources: { title: string; url: string }[];
  projects: { title: string; description: string; url: string }[];
  cvTips: string[];
  interviewPrep: string[];
  stats: string;
}

export const CAREER_DIRECTORY: JobProfile[] = [
  {
    id: "frontend-dev",
    title: "Frontend Developer",
    description: "Focuses on the visual aspects of a website that users interact with. They translate designs into code using HTML, CSS, and JavaScript.",
    salary: "$70,000 - $130,000",
    skills: ["HTML/CSS", "JavaScript (ES6+)", "React/Vue/Angular", "Responsive Design", "Version Control (Git)"],
    skillBreakdown: [
      { name: "HTML/CSS", level: "Core" as const, importance: "Crucial for mastering html/css in this role.", resource: { title: "Learn HTML/CSS", url: "https://www.google.com/search?q=learn+HTML%2FCSS" } },
      { name: "JavaScript (ES6+)", level: "Intermediate" as const, importance: "Crucial for mastering javascript (es6+) in this role.", resource: { title: "Learn JavaScript (ES6+)", url: "https://www.google.com/search?q=learn+JavaScript%20(ES6%2B)" } },
      { name: "React/Vue/Angular", level: "Advanced" as const, importance: "Crucial for mastering react/vue/angular in this role.", resource: { title: "Learn React/Vue/Angular", url: "https://www.google.com/search?q=learn+React%2FVue%2FAngular" } },
      { name: "Responsive Design", level: "Core" as const, importance: "Crucial for mastering responsive design in this role.", resource: { title: "Learn Responsive Design", url: "https://www.google.com/search?q=learn+Responsive%20Design" } },
      { name: "Version Control (Git)", level: "Intermediate" as const, importance: "Crucial for mastering version control (git) in this role.", resource: { title: "Learn Version Control (Git)", url: "https://www.google.com/search?q=learn+Version%20Control%20(Git)" } },
    ],
    resources: [
      { title: "MDN Web Docs - HTML/CSS", url: "https://developer.mozilla.org/en-US/docs/Learn" },
      { title: "JavaScript.info", url: "https://javascript.info/" },
      { title: "React Official Tutorial", url: "https://react.dev/learn" },
      { title: "freeCodeCamp - Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
      { title: "Frontend Masters - Beginner Path", url: "https://frontendmasters.com/guides/learning-roadmap/" }
    ],
    projects: [
      { title: "Personal Portfolio", description: "Build a responsive portfolio site to showcase your work.", url: "https://github.com/topics/portfolio-template" },
      { title: "E-commerce UI", description: "Create a product listing page with filtering and a shopping cart.", url: "https://codepen.io/tag/ecommerce" },
      { title: "Weather Dashboard", description: "Fetch and display weather data from an API.", url: "https://github.com/topics/weather-app" }
    ],
    cvTips: ["Highlight React/Vue projects", "Showcase responsive design skills", "Include links to live demos"],
    interviewPrep: ["Explain the Virtual DOM", "CSS Box Model details", "JavaScript Closures and Hoisting"],
    stats: "High demand with 15% projected growth over the next decade."
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Interprets data and turns it into information which can offer ways to improve a business, thus affecting business decisions.",
    salary: "$65,000 - $110,000",
    skills: ["SQL", "Python/R", "Data Visualization (Tableau/PowerBI)", "Statistics", "Excel (Advanced)"],
    skillBreakdown: [
      { name: "SQL", level: "Core" as const, importance: "Crucial for mastering sql in this role.", resource: { title: "Learn SQL", url: "https://www.google.com/search?q=learn+SQL" } },
      { name: "Python/R", level: "Intermediate" as const, importance: "Crucial for mastering python/r in this role.", resource: { title: "Learn Python/R", url: "https://www.google.com/search?q=learn+Python%2FR" } },
      { name: "Data Visualization (Tableau/PowerBI)", level: "Advanced" as const, importance: "Crucial for mastering data visualization (tableau/powerbi) in this role.", resource: { title: "Learn Data Visualization (Tableau/PowerBI)", url: "https://www.google.com/search?q=learn+Data%20Visualization%20(Tableau%2FPowerBI)" } },
      { name: "Statistics", level: "Core" as const, importance: "Crucial for mastering statistics in this role.", resource: { title: "Learn Statistics", url: "https://www.google.com/search?q=learn+Statistics" } },
      { name: "Excel (Advanced)", level: "Intermediate" as const, importance: "Crucial for mastering excel (advanced) in this role.", resource: { title: "Learn Excel (Advanced)", url: "https://www.google.com/search?q=learn+Excel%20(Advanced)" } },
    ],
    resources: [
      { title: "Google Data Analytics Certificate", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      { title: "SQLZoo - Interactive SQL Tutorial", url: "https://sqlzoo.net/" },
      { title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" },
      { title: "Tableau Public Training", url: "https://public.tableau.com/en-us/s/resources" },
      { title: "Kaggle - Data Analysis Courses", url: "https://www.kaggle.com/learn" }
    ],
    projects: [
      { title: "Sales Data Analysis", description: "Analyze a retail dataset to find trends and insights.", url: "https://github.com/topics/data-analysis-project" },
      { title: "COVID-19 Tracker", description: "Visualize global pandemic data using Python and Matplotlib.", url: "https://github.com/topics/covid-tracker" },
      { title: "Customer Segmentation", description: "Use clustering to group customers based on behavior.", url: "https://github.com/topics/customer-segmentation" }
    ],
    cvTips: ["Quantify your impact (e.g., 'reduced costs by 10%')", "List specific tools like SQL and Tableau", "Include a link to your Kaggle profile"],
    interviewPrep: ["Explain SQL Joins", "Difference between Mean, Median, and Mode", "How to handle missing data"],
    stats: "Rapidly growing field as businesses become more data-driven."
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    description: "Bridges the gap between development and operations teams to improve software development and release cycles.",
    salary: "$90,000 - $160,000",
    skills: ["Docker/Kubernetes", "CI/CD (Jenkins/GitHub Actions)", "Cloud (AWS/Azure/GCP)", "Linux Administration", "Infrastructure as Code (Terraform)"],
    skillBreakdown: [
      { name: "Docker/Kubernetes", level: "Core" as const, importance: "Crucial for mastering docker/kubernetes in this role.", resource: { title: "Learn Docker/Kubernetes", url: "https://www.google.com/search?q=learn+Docker%2FKubernetes" } },
      { name: "CI/CD (Jenkins/GitHub Actions)", level: "Intermediate" as const, importance: "Crucial for mastering ci/cd (jenkins/github actions) in this role.", resource: { title: "Learn CI/CD (Jenkins/GitHub Actions)", url: "https://www.google.com/search?q=learn+CI%2FCD%20(Jenkins%2FGitHub%20Actions)" } },
      { name: "Cloud (AWS/Azure/GCP)", level: "Advanced" as const, importance: "Crucial for mastering cloud (aws/azure/gcp) in this role.", resource: { title: "Learn Cloud (AWS/Azure/GCP)", url: "https://www.google.com/search?q=learn+Cloud%20(AWS%2FAzure%2FGCP)" } },
      { name: "Linux Administration", level: "Core" as const, importance: "Crucial for mastering linux administration in this role.", resource: { title: "Learn Linux Administration", url: "https://www.google.com/search?q=learn+Linux%20Administration" } },
      { name: "Infrastructure as Code (Terraform)", level: "Intermediate" as const, importance: "Crucial for mastering infrastructure as code (terraform) in this role.", resource: { title: "Learn Infrastructure as Code (Terraform)", url: "https://www.google.com/search?q=learn+Infrastructure%20as%20Code%20(Terraform)" } },
    ],
    resources: [
      { title: "DevOps Roadmap", url: "https://roadmap.sh/devops" },
      { title: "Docker Curriculum", url: "https://docker-curriculum.com/" },
      { title: "AWS Cloud Practitioner Essentials", url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials" },
      { title: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
      { title: "Terraform Up & Running", url: "https://www.terraform.io/intro" }
    ],
    projects: [
      { title: "CI/CD Pipeline", description: "Automate the build and deployment of a simple web app.", url: "https://github.com/topics/cicd-pipeline" },
      { title: "Containerized Microservices", description: "Deploy a multi-container app using Docker Compose.", url: "https://github.com/topics/docker-compose" },
      { title: "Cloud Infrastructure Setup", description: "Provision a VPC and EC2 instances using Terraform.", url: "https://github.com/topics/terraform-aws" }
    ],
    cvTips: ["Focus on automation experience", "Mention specific cloud platforms", "Highlight security-first mindset"],
    interviewPrep: ["Explain the CI/CD lifecycle", "What is Infrastructure as Code?", "How do containers differ from VMs?"],
    stats: "One of the highest-paying roles in tech due to specialized skill requirements."
  },
  {
    id: "security-expert",
    title: "Security Expert",
    description: "Protects an organization's computer networks and systems by planning and carrying out security measures.",
    salary: "$85,000 - $150,000",
    skills: ["Network Security", "Ethical Hacking", "Cryptography", "Risk Management", "Compliance (GDPR/HIPAA)"],
    skillBreakdown: [
      { name: "Network Security", level: "Core" as const, importance: "Crucial for mastering network security in this role.", resource: { title: "Learn Network Security", url: "https://www.google.com/search?q=learn+Network%20Security" } },
      { name: "Ethical Hacking", level: "Intermediate" as const, importance: "Crucial for mastering ethical hacking in this role.", resource: { title: "Learn Ethical Hacking", url: "https://www.google.com/search?q=learn+Ethical%20Hacking" } },
      { name: "Cryptography", level: "Advanced" as const, importance: "Crucial for mastering cryptography in this role.", resource: { title: "Learn Cryptography", url: "https://www.google.com/search?q=learn+Cryptography" } },
      { name: "Risk Management", level: "Core" as const, importance: "Crucial for mastering risk management in this role.", resource: { title: "Learn Risk Management", url: "https://www.google.com/search?q=learn+Risk%20Management" } },
      { name: "Compliance (GDPR/HIPAA)", level: "Intermediate" as const, importance: "Crucial for mastering compliance (gdpr/hipaa) in this role.", resource: { title: "Learn Compliance (GDPR/HIPAA)", url: "https://www.google.com/search?q=learn+Compliance%20(GDPR%2FHIPAA)" } },
    ],
    resources: [
      { title: "TryHackMe - Cyber Security Training", url: "https://tryhackme.com/" },
      { title: "Cybrary - Free IT & Cyber Security", url: "https://www.cybrary.it/" },
      { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
      { title: "Cisco Networking Academy", url: "https://www.netacad.com/" },
      { title: "SANS Cyber Aces", url: "https://www.cyberaces.org/" }
    ],
    projects: [
      { title: "Vulnerability Assessment", description: "Perform a security audit on a local network.", url: "https://github.com/topics/vulnerability-scanner" },
      { title: "Encryption Tool", description: "Build a script to encrypt and decrypt files using AES.", url: "https://github.com/topics/encryption" },
      { title: "Firewall Configuration", description: "Set up and test a robust firewall for a small server.", url: "https://github.com/topics/firewall" }
    ],
    cvTips: ["List certifications like CompTIA Security+", "Mention experience with penetration testing", "Highlight knowledge of compliance standards"],
    interviewPrep: ["What is a Man-in-the-Middle attack?", "Explain public vs private key encryption", "How to prevent SQL injection"],
    stats: "Critical role with zero unemployment rate in many regions."
  },
  {
    id: "backend-dev",
    title: "Backend Developer",
    description: "Builds and maintains the server-side logic, databases, and APIs that power web applications.",
    salary: "$80,000 - $140,000",
    skills: ["Node.js/Python/Java", "Databases (PostgreSQL/MongoDB)", "API Design (REST/GraphQL)", "Server Management", "Authentication/Security"],
    skillBreakdown: [
      { name: "Node.js/Python/Java", level: "Core" as const, importance: "Crucial for mastering node.js/python/java in this role.", resource: { title: "Learn Node.js/Python/Java", url: "https://www.google.com/search?q=learn+Node.js%2FPython%2FJava" } },
      { name: "Databases (PostgreSQL/MongoDB)", level: "Intermediate" as const, importance: "Crucial for mastering databases (postgresql/mongodb) in this role.", resource: { title: "Learn Databases (PostgreSQL/MongoDB)", url: "https://www.google.com/search?q=learn+Databases%20(PostgreSQL%2FMongoDB)" } },
      { name: "API Design (REST/GraphQL)", level: "Advanced" as const, importance: "Crucial for mastering api design (rest/graphql) in this role.", resource: { title: "Learn API Design (REST/GraphQL)", url: "https://www.google.com/search?q=learn+API%20Design%20(REST%2FGraphQL)" } },
      { name: "Server Management", level: "Core" as const, importance: "Crucial for mastering server management in this role.", resource: { title: "Learn Server Management", url: "https://www.google.com/search?q=learn+Server%20Management" } },
      { name: "Authentication/Security", level: "Intermediate" as const, importance: "Crucial for mastering authentication/security in this role.", resource: { title: "Learn Authentication/Security", url: "https://www.google.com/search?q=learn+Authentication%2FSecurity" } },
    ],
    resources: [
      { title: "Node.js Documentation", url: "https://nodejs.org/en/docs/" },
      { title: "Django for Beginners", url: "https://djangoforbeginners.com/" },
      { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" },
      { title: "GraphQL Official Guide", url: "https://graphql.org/learn/" },
      { title: "Backend Roadmap", url: "https://roadmap.sh/backend" }
    ],
    projects: [
      { title: "RESTful API", description: "Create a full CRUD API for a blog or task manager.", url: "https://github.com/topics/rest-api" },
      { title: "Chat Application", description: "Build a real-time chat app using WebSockets.", url: "https://github.com/topics/websocket-chat" },
      { title: "Auth System", description: "Implement JWT-based authentication and authorization.", url: "https://github.com/topics/authentication" }
    ],
    cvTips: ["Focus on database optimization skills", "Highlight API design experience", "Mention security practices"],
    interviewPrep: ["Explain REST vs GraphQL", "How do indexes work in databases?", "What is a deadlock?"],
    stats: "Steady demand as every app needs a robust backend."
  },
  {
    id: "fullstack-dev",
    title: "Full Stack Developer",
    description: "Comfortable working on both the frontend and backend of an application.",
    salary: "$85,000 - $150,000",
    skills: ["Frontend + Backend Skills", "DevOps Basics", "System Architecture", "Project Management", "UI/UX Awareness"],
    skillBreakdown: [
      { name: "Frontend + Backend Skills", level: "Core" as const, importance: "Crucial for mastering frontend + backend skills in this role.", resource: { title: "Learn Frontend + Backend Skills", url: "https://www.google.com/search?q=learn+Frontend%20%2B%20Backend%20Skills" } },
      { name: "DevOps Basics", level: "Intermediate" as const, importance: "Crucial for mastering devops basics in this role.", resource: { title: "Learn DevOps Basics", url: "https://www.google.com/search?q=learn+DevOps%20Basics" } },
      { name: "System Architecture", level: "Advanced" as const, importance: "Crucial for mastering system architecture in this role.", resource: { title: "Learn System Architecture", url: "https://www.google.com/search?q=learn+System%20Architecture" } },
      { name: "Project Management", level: "Core" as const, importance: "Crucial for mastering project management in this role.", resource: { title: "Learn Project Management", url: "https://www.google.com/search?q=learn+Project%20Management" } },
      { name: "UI/UX Awareness", level: "Intermediate" as const, importance: "Crucial for mastering ui/ux awareness in this role.", resource: { title: "Learn UI/UX Awareness", url: "https://www.google.com/search?q=learn+UI%2FUX%20Awareness" } },
    ],
    resources: [
      { title: "The Odin Project", url: "https://www.theodinproject.com/" },
      { title: "Full Stack Open", url: "https://fullstackopen.com/en/" },
      { title: "FreeCodeCamp - Full Stack Path", url: "https://www.freecodecamp.org/" },
      { title: "App Academy Open", url: "https://www.appacademy.io/course/app-academy-open" },
      { title: "W3Schools Full Stack Path", url: "https://www.w3schools.com/whatis/whatis_fullstack.asp" }
    ],
    projects: [
      { title: "Social Media Clone", description: "Build a full-featured social platform.", url: "https://github.com/topics/social-media-clone" },
      { title: "SaaS Dashboard", description: "Create a subscription-based dashboard with payments.", url: "https://github.com/topics/saas-boilerplate" },
      { title: "Learning Management System", description: "Develop a platform for online courses.", url: "https://github.com/topics/lms" }
    ],
    cvTips: ["Highlight ability to lead projects from start to finish", "Showcase a diverse portfolio", "Mention cross-functional collaboration"],
    interviewPrep: ["How to choose between SQL and NoSQL?", "Explain the entire request-response cycle", "System design basics"],
    stats: "Highly versatile and sought after by startups and large tech firms alike."
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    description: "Designs and implements machine learning models and algorithms to solve complex problems.",
    salary: "$100,000 - $180,000",
    skills: ["Python", "TensorFlow/PyTorch", "Linear Algebra/Calculus", "Data Engineering", "Model Deployment"],
    skillBreakdown: [
      { name: "Python", level: "Core" as const, importance: "Crucial for mastering python in this role.", resource: { title: "Learn Python", url: "https://www.google.com/search?q=learn+Python" } },
      { name: "TensorFlow/PyTorch", level: "Intermediate" as const, importance: "Crucial for mastering tensorflow/pytorch in this role.", resource: { title: "Learn TensorFlow/PyTorch", url: "https://www.google.com/search?q=learn+TensorFlow%2FPyTorch" } },
      { name: "Linear Algebra/Calculus", level: "Advanced" as const, importance: "Crucial for mastering linear algebra/calculus in this role.", resource: { title: "Learn Linear Algebra/Calculus", url: "https://www.google.com/search?q=learn+Linear%20Algebra%2FCalculus" } },
      { name: "Data Engineering", level: "Core" as const, importance: "Crucial for mastering data engineering in this role.", resource: { title: "Learn Data Engineering", url: "https://www.google.com/search?q=learn+Data%20Engineering" } },
      { name: "Model Deployment", level: "Intermediate" as const, importance: "Crucial for mastering model deployment in this role.", resource: { title: "Learn Model Deployment", url: "https://www.google.com/search?q=learn+Model%20Deployment" } },
    ],
    resources: [
      { title: "Andrew Ng's ML Course", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { title: "Fast.ai - Deep Learning for Coders", url: "https://www.fast.ai/" },
      { title: "Scikit-Learn Documentation", url: "https://scikit-learn.org/stable/user_guide.html" },
      { title: "DeepLearning.AI", url: "https://www.deeplearning.ai/" },
      { title: "Machine Learning Mastery", url: "https://machinelearningmastery.com/" }
    ],
    projects: [
      { title: "Image Classifier", description: "Build a model to identify objects in images.", url: "https://github.com/topics/image-classification" },
      { title: "Sentiment Analysis", description: "Analyze text data to determine emotional tone.", url: "https://github.com/topics/sentiment-analysis" },
      { title: "Recommendation Engine", description: "Create a 'people also liked' system for products.", url: "https://github.com/topics/recommendation-system" }
    ],
    cvTips: ["Focus on mathematical foundation", "Highlight experience with large datasets", "Mention specific ML frameworks"],
    interviewPrep: ["Explain Overfitting and Underfitting", "What is Gradient Descent?", "Difference between Supervised and Unsupervised learning"],
    stats: "One of the fastest-growing and highest-paying roles in the AI era."
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    description: "Oversees a company's cloud computing strategy, including cloud adoption plans, cloud application design, and cloud management and monitoring.",
    salary: "$110,000 - $190,000",
    skills: ["Cloud Platforms (AWS/Azure/GCP)", "System Design", "Networking", "Security", "Cost Optimization"],
    skillBreakdown: [
      { name: "Cloud Platforms (AWS/Azure/GCP)", level: "Core" as const, importance: "Crucial for mastering cloud platforms (aws/azure/gcp) in this role.", resource: { title: "Learn Cloud Platforms (AWS/Azure/GCP)", url: "https://www.google.com/search?q=learn+Cloud%20Platforms%20(AWS%2FAzure%2FGCP)" } },
      { name: "System Design", level: "Intermediate" as const, importance: "Crucial for mastering system design in this role.", resource: { title: "Learn System Design", url: "https://www.google.com/search?q=learn+System%20Design" } },
      { name: "Networking", level: "Advanced" as const, importance: "Crucial for mastering networking in this role.", resource: { title: "Learn Networking", url: "https://www.google.com/search?q=learn+Networking" } },
      { name: "Security", level: "Core" as const, importance: "Crucial for mastering security in this role.", resource: { title: "Learn Security", url: "https://www.google.com/search?q=learn+Security" } },
      { name: "Cost Optimization", level: "Intermediate" as const, importance: "Crucial for mastering cost optimization in this role.", resource: { title: "Learn Cost Optimization", url: "https://www.google.com/search?q=learn+Cost%20Optimization" } },
    ],
    resources: [
      { title: "AWS Solutions Architect Path", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
      { title: "Azure Architecture Center", url: "https://learn.microsoft.com/en-us/azure/architecture/" },
      { title: "Google Cloud Architecture Framework", url: "https://cloud.google.com/architecture/framework" },
      { title: "A Cloud Guru", url: "https://www.pluralsight.com/cloud-guru" },
      { title: "Cloud Academy", url: "https://cloudacademy.com/" }
    ],
    projects: [
      { title: "Multi-Region Deployment", description: "Design a highly available system across multiple regions.", url: "https://github.com/topics/high-availability" },
      { title: "Serverless Application", description: "Build an app using only serverless components (Lambda, S3, DynamoDB).", url: "https://github.com/topics/serverless" },
      { title: "Cloud Migration Plan", description: "Document a strategy to move an on-premise app to the cloud.", url: "https://github.com/topics/cloud-migration" }
    ],
    cvTips: ["Highlight certifications", "Showcase experience with large-scale migrations", "Mention cost-saving achievements"],
    interviewPrep: ["Explain the Shared Responsibility Model", "What is Serverless computing?", "How to design for scalability?"],
    stats: "Essential role as more companies move their operations to the cloud."
  },
  {
    id: "mobile-developer",
    title: "Mobile Developer",
    description: "Specializes in building applications for mobile devices like smartphones and tablets.",
    salary: "$75,000 - $135,000",
    skills: ["Swift (iOS)", "Kotlin (Android)", "React Native/Flutter", "Mobile UI/UX", "App Store Deployment"],
    skillBreakdown: [
      { name: "Swift (iOS)", level: "Core" as const, importance: "Crucial for mastering swift (ios) in this role.", resource: { title: "Learn Swift (iOS)", url: "https://www.google.com/search?q=learn+Swift%20(iOS)" } },
      { name: "Kotlin (Android)", level: "Intermediate" as const, importance: "Crucial for mastering kotlin (android) in this role.", resource: { title: "Learn Kotlin (Android)", url: "https://www.google.com/search?q=learn+Kotlin%20(Android)" } },
      { name: "React Native/Flutter", level: "Advanced" as const, importance: "Crucial for mastering react native/flutter in this role.", resource: { title: "Learn React Native/Flutter", url: "https://www.google.com/search?q=learn+React%20Native%2FFlutter" } },
      { name: "Mobile UI/UX", level: "Core" as const, importance: "Crucial for mastering mobile ui/ux in this role.", resource: { title: "Learn Mobile UI/UX", url: "https://www.google.com/search?q=learn+Mobile%20UI%2FUX" } },
      { name: "App Store Deployment", level: "Intermediate" as const, importance: "Crucial for mastering app store deployment in this role.", resource: { title: "Learn App Store Deployment", url: "https://www.google.com/search?q=learn+App%20Store%20Deployment" } },
    ],
    resources: [
      { title: "Swift Playgrounds", url: "https://www.apple.com/swift/playgrounds/" },
      { title: "Android Developers Training", url: "https://developer.android.com/courses" },
      { title: "React Native Express", url: "https://www.reactnativeexpress.com/" },
      { title: "Flutter Codelabs", url: "https://docs.flutter.dev/codelabs" },
      { title: "Ray Wenderlich Tutorials", url: "https://www.kodeco.com/" }
    ],
    projects: [
      { title: "Fitness Tracker App", description: "Build an app to log workouts and track progress.", url: "https://github.com/topics/fitness-app" },
      { title: "Recipe Finder", description: "Create an app that suggests recipes based on ingredients.", url: "https://github.com/topics/recipe-app" },
      { title: "Expense Manager", description: "Develop a tool to track daily spending and budgets.", url: "https://github.com/topics/expense-tracker" }
    ],
    cvTips: ["Include links to App Store/Play Store", "Showcase UI/UX design skills", "Mention experience with cross-platform tools"],
    interviewPrep: ["Explain the mobile app lifecycle", "Difference between Native and Hybrid apps", "How to handle offline mode?"],
    stats: "High demand as mobile usage continues to dominate internet traffic."
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What kind of problems do you enjoy solving most?",
    options: [
      { text: "Visual and interactive design challenges", category: "dev" },
      { text: "Finding patterns and insights in complex information", category: "data" },
      { text: "Optimizing systems and automating repetitive tasks", category: "ops" }
    ]
  },
  {
    id: 2,
    question: "Which of these tools or concepts sounds most interesting?",
    options: [
      { text: "Building beautiful user interfaces with React", category: "dev" },
      { text: "Writing SQL queries to extract business insights", category: "data" },
      { text: "Managing servers and deploying applications with Docker", category: "ops" }
    ]
  },
  {
    id: 3,
    question: "How do you prefer to see the results of your work?",
    options: [
      { text: "Instantly seeing a change on a website or app", category: "dev" },
      { text: "Presenting a clear chart or report that tells a story", category: "data" },
      { text: "Knowing that a system is running smoothly and efficiently", category: "ops" }
    ]
  }
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Land Your First Tech Job in 2024",
    excerpt: "The tech landscape is changing. Here's what you need to know to stand out from the crowd...",
    content: "Landing your first tech job requires more than just coding skills. You need a strong portfolio, a polished LinkedIn profile, and excellent networking skills. Start by building real-world projects that solve actual problems. Contribute to open-source software to show you can work in a team. Finally, don't be afraid to reach out to recruiters and engineers at companies you admire.",
    date: "Oct 12, 2024"
  },
  {
    id: 2,
    title: "Top 5 Skills Every Developer Needs",
    excerpt: "Beyond coding, these soft and hard skills will accelerate your career growth...",
    content: "1. Problem Solving: The ability to break down complex problems into manageable parts. 2. Communication: Explaining technical concepts to non-technical stakeholders. 3. Version Control: Proficiency in Git is non-negotiable. 4. Continuous Learning: Tech moves fast; you must keep up. 5. Empathy: Understanding the user's needs and your teammates' perspectives.",
    date: "Nov 5, 2024"
  },
  {
    id: 3,
    title: "The Future of Remote Work in Tech",
    excerpt: "Is the remote work era over, or just evolving? We dive into the latest trends...",
    content: "While some companies are pushing for a return to the office, remote and hybrid work models remain popular in the tech industry. The key to success in a remote environment is strong self-discipline and clear communication. Tools like Slack, Zoom, and Jira are essential, but the human element—building trust and rapport—is what truly makes remote teams thrive.",
    date: "Dec 1, 2024"
  }
];
