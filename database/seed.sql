-- ============================================================
-- LEARNOVA Seed Data
-- 70 realistic resources + demo users + interaction history
-- Run AFTER schema.sql
-- ============================================================
USE learnova;

-- ============================================================
-- DEMO USERS (passwords hashed with bcrypt)
-- admin@learnova.local   -> Admin@1234
-- student@learnova.local -> Student@1234
-- alice@learnova.local   -> Alice@1234
-- bob@learnova.local     -> Bob@1234
-- ============================================================
INSERT INTO users (name, email, password, role) VALUES
('Admin User',    'admin@learnova.local',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMZJaaaOfvbMRO.MHDjMpb8Pzm', 'admin'),
('Alex Johnson',  'student@learnova.local', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC02G4R5YHl4YGQR4kFm', 'learner'),
('Alice Chen',    'alice@learnova.local',   '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC02G4R5YHl4YGQR4kFm', 'learner'),
('Bob Martinez',  'bob@learnova.local',     '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC02G4R5YHl4YGQR4kFm', 'learner');

-- ============================================================
-- PROFILES
-- ============================================================
INSERT INTO profiles (user_id, skills, goals, difficulty, completed_at) VALUES
(2,
 '["Python","JavaScript","HTML","CSS","SQL","Data Structures"]',
 '["Become a Full Stack Developer","Learn Web Development","Learn Data Science"]',
 'Intermediate',
 NOW()),
(3,
 '["Python","Algorithms","Data Structures","SQL"]',
 '["Learn Data Science","Learn AI/ML","Prepare for Technical Interviews"]',
 'Intermediate',
 NOW()),
(4,
 '["JavaScript","HTML","CSS"]',
 '["Learn Web Development","Become a Frontend Developer"]',
 'Beginner',
 NOW());

-- ============================================================
-- RESOURCES (70 realistic entries)
-- ============================================================
INSERT INTO resources (title, description, category, tags, difficulty, prerequisites, url, average_rating, rating_count) VALUES

-- PROGRAMMING FUNDAMENTALS (1-8)
('Programming Fundamentals with Python',
 'A comprehensive introduction to programming using Python. Covers variables, control flow, functions, and problem-solving techniques. Ideal for absolute beginners entering the world of software development.',
 'Programming',
 '["Python","Programming","Basics","Problem Solving"]',
 'Beginner', '[]',
 'https://learnova.local/courses/python-fundamentals', 4.60, 245),

('Introduction to Algorithms',
 'Discover the foundations of algorithmic thinking. Learn about time complexity, space complexity, sorting algorithms, and searching techniques used in modern software engineering.',
 'Algorithms',
 '["Algorithms","Sorting","Searching","Big O Notation","Problem Solving"]',
 'Beginner', '["Programming Fundamentals"]',
 'https://learnova.local/courses/intro-algorithms', 4.45, 189),

('Data Structures from Scratch',
 'Master essential data structures including arrays, linked lists, stacks, queues, and hash tables. Build intuition for choosing the right data structure for each problem.',
 'Data Structures',
 '["Data Structures","Arrays","Linked Lists","Stacks","Queues","Hash Maps"]',
 'Beginner', '["Programming Fundamentals"]',
 'https://learnova.local/courses/data-structures-scratch', 4.55, 210),

('Object-Oriented Programming Principles',
 'Deep dive into OOP concepts: encapsulation, inheritance, polymorphism, and abstraction. Learn design thinking through practical examples in Python and Java.',
 'Programming',
 '["OOP","Python","Java","Design Patterns","Software Design"]',
 'Intermediate', '["Programming Fundamentals"]',
 'https://learnova.local/courses/oop-principles', 4.40, 176),

('C++ Essentials for Competitive Programming',
 'Build strong C++ foundations tailored for competitive programming. Learn STL, pointers, memory management, and performance optimization techniques.',
 'Programming',
 '["C++","STL","Competitive Programming","Pointers","Performance"]',
 'Intermediate', '["Programming Fundamentals","Data Structures"]',
 'https://learnova.local/courses/cpp-competitive', 4.35, 143),

('Java Programming: From Fundamentals to Professional',
 'A complete Java learning path covering core syntax, collections framework, streams, concurrency, and modern Java features. Industry-focused curriculum.',
 'Programming',
 '["Java","OOP","Collections","Streams","Concurrency","Spring"]',
 'Intermediate', '["Programming Fundamentals","OOP"]',
 'https://learnova.local/courses/java-professional', 4.50, 198),

('Advanced Algorithms & Complexity Theory',
 'Explore advanced algorithmic paradigms: dynamic programming, greedy algorithms, graph algorithms, and NP-completeness. Essential for senior software engineers.',
 'Algorithms',
 '["Algorithms","Dynamic Programming","Graph Algorithms","Greedy","NP-Complete"]',
 'Advanced', '["Data Structures","Introduction to Algorithms","Programming Fundamentals"]',
 'https://learnova.local/courses/advanced-algorithms', 4.70, 112),

('Competitive Programming Mastery',
 'Sharpen your competitive programming skills with curated problem sets covering number theory, combinatorics, segment trees, and advanced graph techniques.',
 'Algorithms',
 '["Competitive Programming","C++","Advanced Algorithms","Number Theory","Graph Algorithms"]',
 'Advanced', '["Advanced Algorithms","C++ Essentials","Data Structures"]',
 'https://learnova.local/courses/competitive-programming-mastery', 4.65, 88),

-- WEB DEVELOPMENT (9-18)
('HTML & CSS for Absolute Beginners',
 'Build your first website from scratch. Learn semantic HTML5 elements, CSS fundamentals, box model, flexbox, and basic responsive design principles.',
 'Web Development',
 '["HTML","CSS","Web Development","Responsive Design","Beginners"]',
 'Beginner', '[]',
 'https://learnova.local/courses/html-css-beginners', 4.55, 320),

('Modern CSS: Flexbox, Grid & Animations',
 'Master advanced CSS layout systems and create stunning visual animations. Learn CSS Grid, Flexbox deep dive, custom properties, and keyframe animations.',
 'Frontend Development',
 '["CSS","Flexbox","Grid","Animations","Frontend","Responsive Design"]',
 'Intermediate', '["HTML & CSS Fundamentals"]',
 'https://learnova.local/courses/modern-css', 4.45, 195),

('JavaScript: The Complete Modern Guide',
 'From variables to async/await — the definitive modern JavaScript course. Covers ES6+, closures, prototypes, DOM manipulation, fetch API, and modern patterns.',
 'Web Development',
 '["JavaScript","ES6","Async","DOM","Frontend","Modern JS"]',
 'Beginner', '["HTML & CSS Fundamentals"]',
 'https://learnova.local/courses/javascript-complete', 4.75, 412),

('TypeScript Deep Dive',
 'Bring type safety to your JavaScript projects. Learn TypeScript type system, interfaces, generics, decorators, and integration with popular frameworks.',
 'Frontend Development',
 '["TypeScript","JavaScript","Type Safety","Generics","Frontend"]',
 'Intermediate', '["JavaScript Complete Guide"]',
 'https://learnova.local/courses/typescript-deep-dive', 4.60, 167),

('React.js: Building Modern UIs',
 'Build production-ready React applications. Learn components, hooks, context API, React Query, performance optimization, and best practices for scalable UIs.',
 'Frontend Development',
 '["React","JavaScript","Hooks","Components","Frontend","State Management"]',
 'Intermediate', '["JavaScript Fundamentals","HTML","CSS"]',
 'https://learnova.local/courses/react-modern-ui', 4.80, 389),

('Next.js Full-Stack Development',
 'Build full-stack web applications with Next.js. Covers server-side rendering, API routes, static generation, middleware, and deployment strategies.',
 'Full Stack Development',
 '["Next.js","React","Full Stack","SSR","API Routes","TypeScript"]',
 'Advanced', '["React.js","JavaScript","Node.js"]',
 'https://learnova.local/courses/nextjs-fullstack', 4.65, 144),

('Vue.js 3 Essentials',
 'Learn Vue.js 3 Composition API, reactivity system, Pinia state management, Vue Router, and building scalable single-page applications.',
 'Frontend Development',
 '["Vue.js","JavaScript","SPA","Composition API","Frontend"]',
 'Intermediate', '["JavaScript Fundamentals"]',
 'https://learnova.local/courses/vuejs3', 4.40, 133),

('Node.js Backend Development',
 'Build robust REST APIs with Node.js and Express. Learn middleware, authentication, file uploads, error handling, and best practices for production backends.',
 'Backend Development',
 '["Node.js","Express","REST API","Backend","JavaScript","Middleware"]',
 'Intermediate', '["JavaScript Fundamentals","HTTP Basics"]',
 'https://learnova.local/courses/nodejs-backend', 4.55, 221),

('GraphQL API Design',
 'Design and implement GraphQL APIs from scratch. Learn schemas, resolvers, mutations, subscriptions, and compare GraphQL with REST for modern API design.',
 'Backend Development',
 '["GraphQL","API Design","Node.js","Backend","Schema Design"]',
 'Advanced', '["Node.js Backend","REST API Design"]',
 'https://learnova.local/courses/graphql-design', 4.45, 98),

('Web Performance Optimization',
 'Improve your web application performance. Learn Core Web Vitals, lazy loading, code splitting, caching strategies, CDN optimization, and performance auditing.',
 'Web Development',
 '["Performance","Web Optimization","Core Web Vitals","Caching","Frontend"]',
 'Advanced', '["React.js","JavaScript","Web Development"]',
 'https://learnova.local/courses/web-performance', 4.50, 87),

-- BACKEND DEVELOPMENT (19-26)
('REST API Design & Best Practices',
 'Design clean, scalable REST APIs following industry standards. Covers resource naming, HTTP methods, versioning, authentication patterns, and documentation.',
 'Backend Development',
 '["REST API","API Design","HTTP","Backend","Best Practices","Documentation"]',
 'Intermediate', '["Programming Fundamentals","HTTP Basics"]',
 'https://learnova.local/courses/rest-api-design', 4.65, 234),

('Flask: Python Web Framework',
 'Build production-ready web applications and APIs with Flask. Learn routing, blueprints, authentication, database integration, and deployment strategies.',
 'Backend Development',
 '["Flask","Python","Backend","REST API","Web Development"]',
 'Intermediate', '["Python Fundamentals","REST API Basics"]',
 'https://learnova.local/courses/flask-python', 4.55, 178),

('Django: Full-Stack Python Web Development',
 'Master Django framework for rapid web development. Covers ORM, admin panel, authentication, class-based views, DRF for APIs, and production deployment.',
 'Backend Development',
 '["Django","Python","Full Stack","ORM","REST API","Backend"]',
 'Intermediate', '["Python Fundamentals","Databases","OOP"]',
 'https://learnova.local/courses/django-fullstack', 4.70, 253),

('Microservices Architecture Patterns',
 'Design and implement microservices systems. Learn service decomposition, API gateways, service discovery, distributed tracing, and resilience patterns.',
 'Software Engineering',
 '["Microservices","Architecture","Docker","API Gateway","Distributed Systems"]',
 'Advanced', '["Backend Development","REST API","Databases"]',
 'https://learnova.local/courses/microservices-patterns', 4.60, 119),

('Message Queues & Event-Driven Architecture',
 'Build event-driven systems using RabbitMQ and Apache Kafka. Learn pub/sub patterns, event sourcing, CQRS, and reliable message processing at scale.',
 'Backend Development',
 '["Message Queues","Kafka","RabbitMQ","Event-Driven","Backend","Scalability"]',
 'Advanced', '["Microservices","Backend Development","Databases"]',
 'https://learnova.local/courses/message-queues', 4.40, 76),

('Authentication & Security for APIs',
 'Implement robust authentication and authorization in your APIs. Covers JWT, OAuth 2.0, session management, rate limiting, and OWASP security practices.',
 'Backend Development',
 '["Authentication","JWT","OAuth","Security","REST API","Backend"]',
 'Intermediate', '["REST API Design","Backend Fundamentals"]',
 'https://learnova.local/courses/api-security', 4.70, 201),

('Python Async Programming with asyncio',
 'Write high-performance asynchronous Python code. Learn asyncio, coroutines, event loops, async/await patterns, and building concurrent web applications.',
 'Programming',
 '["Python","Async","asyncio","Performance","Concurrency","Backend"]',
 'Advanced', '["Python Fundamentals","Backend Development"]',
 'https://learnova.local/courses/python-async', 4.45, 91),

('gRPC & Protocol Buffers',
 'Build high-performance inter-service communication with gRPC. Learn Protocol Buffers, streaming, service definitions, and integration with microservices.',
 'Backend Development',
 '["gRPC","Protocol Buffers","Microservices","Backend","Performance","API Design"]',
 'Advanced', '["Microservices","REST API","Backend Development"]',
 'https://learnova.local/courses/grpc-protobuf', 4.35, 62),

-- DATABASES (27-34)
('SQL Fundamentals & Database Design',
 'Master SQL from the ground up. Learn DDL, DML, joins, subqueries, transactions, normalization, and database design principles with practical exercises.',
 'Database',
 '["SQL","Database Design","MySQL","Normalization","Joins","Transactions"]',
 'Beginner', '[]',
 'https://learnova.local/courses/sql-fundamentals', 4.65, 298),

('Advanced SQL & Query Optimization',
 'Level up your SQL skills with window functions, CTEs, query execution plans, indexing strategies, and performance tuning for large-scale databases.',
 'Database',
 '["SQL","Advanced SQL","Query Optimization","Indexing","Performance","Window Functions"]',
 'Advanced', '["SQL Fundamentals","Database Design"]',
 'https://learnova.local/courses/advanced-sql', 4.60, 142),

('PostgreSQL: Professional Database Administration',
 'Become a PostgreSQL expert. Learn partitioning, replication, full-text search, JSONB, extensions, and managing high-availability PostgreSQL clusters.',
 'Database',
 '["PostgreSQL","Database Administration","SQL","Replication","Performance"]',
 'Advanced', '["SQL Fundamentals","Database Design"]',
 'https://learnova.local/courses/postgresql-dba', 4.55, 108),

('MongoDB: NoSQL for Modern Applications',
 'Build flexible, scalable applications with MongoDB. Learn document model, aggregation pipeline, indexing, transactions, and schema design patterns.',
 'Database',
 '["MongoDB","NoSQL","Database","Aggregation","Schema Design","Backend"]',
 'Intermediate', '["Programming Fundamentals","Database Concepts"]',
 'https://learnova.local/courses/mongodb-modern', 4.50, 167),

('Redis: Caching & Real-Time Data Structures',
 'Use Redis for caching, session storage, pub/sub, and real-time leaderboards. Learn Redis data structures, persistence, replication, and Lua scripting.',
 'Database',
 '["Redis","Caching","NoSQL","Real-time","Performance","Backend"]',
 'Intermediate', '["Backend Development","Databases"]',
 'https://learnova.local/courses/redis-caching', 4.55, 134),

('Database Internals: How Databases Really Work',
 'Understand the internals of modern databases. Learn B-trees, buffer management, WAL, MVCC, distributed transactions, and the architecture of storage engines.',
 'Database',
 '["Database Internals","Storage Engines","MVCC","B-trees","Distributed Databases"]',
 'Advanced', '["Advanced SQL","Database Design","Algorithms"]',
 'https://learnova.local/courses/database-internals', 4.75, 89),

('Data Modeling & Schema Design Patterns',
 'Design effective database schemas for real-world applications. Learn normalization vs denormalization trade-offs, entity modeling, and NoSQL design patterns.',
 'Database',
 '["Data Modeling","Schema Design","SQL","NoSQL","Database Design","Best Practices"]',
 'Intermediate', '["SQL Fundamentals"]',
 'https://learnova.local/courses/data-modeling', 4.45, 119),

('Elasticsearch: Search & Analytics Engine',
 'Build powerful search and analytics with Elasticsearch. Learn inverted indexes, full-text search, aggregations, and integrating search into applications.',
 'Database',
 '["Elasticsearch","Search","Analytics","NoSQL","Full-text Search","Backend"]',
 'Advanced', '["Backend Development","Databases","REST API"]',
 'https://learnova.local/courses/elasticsearch', 4.40, 77),

-- DATA SCIENCE & AI/ML (35-44)
('Python for Data Science',
 'Start your data science journey with Python. Learn NumPy, Pandas, Matplotlib, and Seaborn to analyze, manipulate, and visualize real-world datasets.',
 'Data Science',
 '["Python","Data Science","NumPy","Pandas","Matplotlib","Data Analysis"]',
 'Beginner', '["Programming Fundamentals","Python Basics"]',
 'https://learnova.local/courses/python-data-science', 4.70, 356),

('Machine Learning Fundamentals',
 'Build a solid foundation in machine learning. Learn supervised and unsupervised learning, model evaluation, feature engineering, and scikit-learn.',
 'AI/ML',
 '["Machine Learning","scikit-learn","Python","Data Science","AI","Algorithms"]',
 'Intermediate', '["Python for Data Science","Statistics Basics","Linear Algebra"]',
 'https://learnova.local/courses/ml-fundamentals', 4.75, 289),

('Deep Learning with PyTorch',
 'Build and train neural networks using PyTorch. Covers CNNs, RNNs, attention mechanisms, transfer learning, and deploying models in production.',
 'AI/ML',
 '["Deep Learning","PyTorch","Neural Networks","CNN","RNN","AI","Python"]',
 'Advanced', '["Machine Learning Fundamentals","Python","Linear Algebra"]',
 'https://learnova.local/courses/deep-learning-pytorch', 4.80, 198),

('Natural Language Processing with Transformers',
 'Master NLP using state-of-the-art transformer models. Learn tokenization, BERT, GPT fine-tuning, named entity recognition, and sentiment analysis.',
 'AI/ML',
 '["NLP","Transformers","BERT","GPT","Python","Deep Learning","AI"]',
 'Advanced', '["Deep Learning","Machine Learning Fundamentals","Python"]',
 'https://learnova.local/courses/nlp-transformers', 4.70, 134),

('Computer Vision with OpenCV & TensorFlow',
 'Build computer vision applications from scratch. Learn image processing, object detection, segmentation, face recognition, and real-time video analysis.',
 'AI/ML',
 '["Computer Vision","OpenCV","TensorFlow","Python","Object Detection","Deep Learning"]',
 'Advanced', '["Deep Learning","Python","Machine Learning"]',
 'https://learnova.local/courses/computer-vision', 4.65, 112),

('Data Analysis with Pandas & NumPy',
 'Master data manipulation and analysis with Pandas and NumPy. Learn data cleaning, transformation, merging, groupby operations, and time series analysis.',
 'Data Science',
 '["Pandas","NumPy","Python","Data Analysis","Data Science","Data Cleaning"]',
 'Intermediate', '["Python for Data Science"]',
 'https://learnova.local/courses/pandas-numpy', 4.60, 221),

('Statistics for Data Science',
 'Build the statistical foundation needed for data science. Learn probability, distributions, hypothesis testing, regression, and Bayesian inference.',
 'Data Science',
 '["Statistics","Probability","Data Science","Regression","Hypothesis Testing"]',
 'Intermediate', '["Python Basics","Mathematics Fundamentals"]',
 'https://learnova.local/courses/statistics-ds', 4.55, 178),

('MLOps: Deploying Machine Learning at Scale',
 'Bridge the gap between ML research and production. Learn model versioning, CI/CD for ML, feature stores, monitoring drift, and serving models at scale.',
 'AI/ML',
 '["MLOps","Machine Learning","Docker","CI/CD","Model Deployment","Production ML"]',
 'Advanced', '["Machine Learning Fundamentals","Docker","Python"]',
 'https://learnova.local/courses/mlops', 4.60, 87),

('Recommender Systems from Scratch',
 'Build recommendation engines using collaborative filtering, content-based filtering, matrix factorization, and neural approaches. Includes a capstone project.',
 'AI/ML',
 '["Recommender Systems","Machine Learning","Collaborative Filtering","Python","AI"]',
 'Advanced', '["Machine Learning Fundamentals","Linear Algebra","Python"]',
 'https://learnova.local/courses/recommender-systems', 4.65, 76),

('Data Visualization with Plotly & Dash',
 'Create interactive dashboards and visualizations. Learn Plotly Express, Dash framework, and build data-driven applications for stakeholder presentations.',
 'Data Science',
 '["Data Visualization","Plotly","Dash","Python","Data Science","Dashboard"]',
 'Intermediate', '["Python for Data Science","Pandas"]',
 'https://learnova.local/courses/data-visualization', 4.45, 132),

('Reinforcement Learning Fundamentals',
 'Understand the theory and practice of reinforcement learning. Learn Q-learning, policy gradients, DQN, and build agents that learn from environments.',
 'AI/ML',
 '["Reinforcement Learning","AI","Deep Learning","Python","Q-Learning"]',
 'Advanced', '["Deep Learning","Machine Learning Fundamentals","Python"]',
 'https://learnova.local/courses/reinforcement-learning', 4.55, 67),

-- CLOUD & DEVOPS (45-52)
('Docker Fundamentals to Production',
 'Containerize your applications with Docker. Learn Dockerfile writing, Docker Compose, networking, volumes, and best practices for running containers in production.',
 'DevOps',
 '["Docker","Containerization","DevOps","Linux","Microservices","CI/CD"]',
 'Intermediate', '["Linux Basics","Backend Development"]',
 'https://learnova.local/courses/docker-production', 4.70, 267),

('Kubernetes: Container Orchestration',
 'Manage containerized applications at scale with Kubernetes. Learn pods, deployments, services, ingress, RBAC, and operating production Kubernetes clusters.',
 'DevOps',
 '["Kubernetes","Docker","DevOps","Container Orchestration","Cloud","Microservices"]',
 'Advanced', '["Docker","Networking","Linux"]',
 'https://learnova.local/courses/kubernetes', 4.65, 178),

('AWS Cloud Practitioner & Solutions Architect',
 'Master AWS core services including EC2, S3, RDS, Lambda, VPC, and IAM. Build scalable, fault-tolerant cloud architectures for production workloads.',
 'Cloud Computing',
 '["AWS","Cloud Computing","S3","EC2","Lambda","Solutions Architecture"]',
 'Intermediate', '["Networking Basics","Linux Basics"]',
 'https://learnova.local/courses/aws-solutions-architect', 4.75, 312),

('CI/CD Pipeline Design & Implementation',
 'Build modern CI/CD pipelines using GitHub Actions, Jenkins, and GitLab CI. Learn automated testing, deployment strategies, and DevOps best practices.',
 'DevOps',
 '["CI/CD","GitHub Actions","Jenkins","DevOps","Automation","Testing"]',
 'Intermediate', '["Linux Basics","Git","Docker"]',
 'https://learnova.local/courses/cicd-pipelines', 4.60, 189),

('Infrastructure as Code with Terraform',
 'Provision and manage cloud infrastructure declaratively using Terraform. Learn HCL, state management, modules, and multi-cloud deployment strategies.',
 'DevOps',
 '["Terraform","Infrastructure as Code","DevOps","AWS","Cloud","Automation"]',
 'Advanced', '["AWS or Cloud Basics","Linux","Docker"]',
 'https://learnova.local/courses/terraform', 4.55, 134),

('Linux System Administration',
 'Become proficient in Linux administration. Learn shell scripting, process management, networking, security hardening, and system monitoring.',
 'Operating Systems',
 '["Linux","System Administration","Shell Scripting","Networking","OS","Security"]',
 'Intermediate', '["Operating Systems Basics"]',
 'https://learnova.local/courses/linux-admin', 4.60, 223),

('Site Reliability Engineering (SRE)',
 'Apply SRE principles to build reliable, scalable systems. Learn SLOs, SLAs, error budgets, incident response, chaos engineering, and observability.',
 'DevOps',
 '["SRE","DevOps","Monitoring","Reliability","Kubernetes","Observability"]',
 'Advanced', '["Kubernetes","Linux","Backend Development","Cloud Computing"]',
 'https://learnova.local/courses/sre', 4.50, 89),

('Serverless Architecture with AWS Lambda',
 'Build cost-effective, scalable applications using serverless computing. Learn AWS Lambda, API Gateway, DynamoDB, and event-driven serverless patterns.',
 'Cloud Computing',
 '["Serverless","AWS Lambda","Cloud Computing","API Gateway","Backend","Event-Driven"]',
 'Advanced', '["AWS Basics","Backend Development","REST API"]',
 'https://learnova.local/courses/serverless', 4.55, 109),

-- NETWORKING & OS (53-58)
('Computer Networks: From Fundamentals to Protocols',
 'Understand how the internet works. Learn OSI model, TCP/IP stack, DNS, HTTP/HTTPS, TLS, routing protocols, and network troubleshooting techniques.',
 'Networking',
 '["Networking","TCP/IP","HTTP","DNS","Protocols","Computer Networks","OSI Model"]',
 'Beginner', '[]',
 'https://learnova.local/courses/computer-networks', 4.55, 213),

('Network Security & Ethical Hacking',
 'Learn offensive and defensive network security techniques. Covers penetration testing methodology, common vulnerabilities, and securing network infrastructure.',
 'Cybersecurity',
 '["Network Security","Ethical Hacking","Penetration Testing","Cybersecurity","Networking"]',
 'Advanced', '["Computer Networks","Linux","Security Fundamentals"]',
 'https://learnova.local/courses/network-security', 4.60, 145),

('Operating Systems: Concepts & Implementation',
 'Explore OS internals: process scheduling, memory management, file systems, synchronization, deadlocks, and virtual memory. Includes coding labs.',
 'Operating Systems',
 '["Operating Systems","Processes","Memory Management","File Systems","Scheduling","OS Concepts"]',
 'Intermediate', '["Programming Fundamentals","C Programming Basics"]',
 'https://learnova.local/courses/os-concepts', 4.65, 169),

('Distributed Systems Design',
 'Design distributed systems for reliability and scale. Learn CAP theorem, consensus algorithms, consistent hashing, and distributed coordination patterns.',
 'Software Engineering',
 '["Distributed Systems","CAP Theorem","Consensus","Scalability","Architecture","Backend"]',
 'Advanced', '["Operating Systems","Networking","Backend Development","Databases"]',
 'https://learnova.local/courses/distributed-systems', 4.70, 98),

('Computer Organization & Architecture',
 'Understand how computers work at the hardware level. Learn CPU architecture, instruction sets, memory hierarchy, pipelining, and cache optimization.',
 'Computer Science',
 '["Computer Architecture","CPU","Memory Hierarchy","Assembly","Hardware","OS"]',
 'Intermediate', '["Programming Fundamentals","Operating Systems Basics"]',
 'https://learnova.local/courses/computer-architecture', 4.45, 134),

('Cybersecurity Fundamentals & OWASP',
 'Build a strong security foundation. Learn OWASP Top 10, common attack vectors, secure coding practices, encryption basics, and security testing.',
 'Cybersecurity',
 '["Cybersecurity","OWASP","Security","Web Security","Encryption","Secure Coding"]',
 'Intermediate', '["Web Development","Networking","Programming Fundamentals"]',
 'https://learnova.local/courses/cybersecurity-fundamentals', 4.65, 178),

-- SOFTWARE ENGINEERING (59-64)
('Software Engineering Principles & Design Patterns',
 'Apply SOLID principles and classic design patterns in your code. Learn Gang of Four patterns, architectural patterns, and clean code principles.',
 'Software Engineering',
 '["Design Patterns","SOLID","Clean Code","Software Engineering","Architecture","OOP"]',
 'Intermediate', '["OOP Principles","Programming Fundamentals"]',
 'https://learnova.local/courses/design-patterns', 4.75, 221),

('Clean Code & Code Review Best Practices',
 'Write code that is readable, maintainable, and testable. Learn naming conventions, functions, error handling, testing strategies, and code review culture.',
 'Software Engineering',
 '["Clean Code","Code Review","Best Practices","Software Engineering","Testing","Refactoring"]',
 'Intermediate', '["Programming Fundamentals","OOP"]',
 'https://learnova.local/courses/clean-code', 4.70, 198),

('Git & Version Control Mastery',
 'Master Git workflows for collaborative development. Learn branching strategies, rebasing, merge conflicts, GitHub workflows, and monorepo management.',
 'Software Engineering',
 '["Git","Version Control","GitHub","Branching","Software Engineering","Collaboration"]',
 'Beginner', '[]',
 'https://learnova.local/courses/git-mastery', 4.60, 345),

('Agile Development & Scrum',
 'Learn Agile methodologies and Scrum framework for modern software delivery. Covers sprints, user stories, retrospectives, and scaling Agile in large teams.',
 'Software Engineering',
 '["Agile","Scrum","Software Engineering","Project Management","Team Collaboration"]',
 'Beginner', '[]',
 'https://learnova.local/courses/agile-scrum', 4.45, 267),

('Software Testing: Unit, Integration & E2E',
 'Build a comprehensive testing strategy. Learn unit testing, integration testing, TDD, BDD, mocking, and end-to-end testing with Playwright.',
 'Software Engineering',
 '["Testing","TDD","BDD","Unit Testing","Integration Testing","E2E Testing","Software Quality"]',
 'Intermediate', '["Programming Fundamentals","Backend Development"]',
 'https://learnova.local/courses/software-testing', 4.65, 156),

('Refactoring & Technical Debt Management',
 'Improve legacy code systematically without breaking functionality. Learn refactoring patterns, identifying code smells, strangler fig pattern, and managing tech debt.',
 'Software Engineering',
 '["Refactoring","Technical Debt","Clean Code","Software Engineering","Testing","Architecture"]',
 'Advanced', '["Clean Code","Software Testing","Design Patterns"]',
 'https://learnova.local/courses/refactoring', 4.55, 88),

-- SYSTEM DESIGN (65-70)
('System Design Interview Preparation',
 'Ace the system design interview. Learn to design scalable systems: URL shortener, Twitter feed, ride-sharing, distributed cache, and search engines.',
 'System Design',
 '["System Design","Interview Preparation","Scalability","Architecture","Distributed Systems"]',
 'Advanced', '["Backend Development","Databases","Networking","Distributed Systems"]',
 'https://learnova.local/courses/system-design-interview', 4.85, 378),

('Low-Level Design & Object Modeling',
 'Master low-level system design using OOP principles. Learn to model systems like parking lots, elevators, library management, and chess games for interviews.',
 'System Design',
 '["Low-Level Design","OOP","Design Patterns","System Design","Interview Preparation"]',
 'Intermediate', '["OOP Principles","Design Patterns"]',
 'https://learnova.local/courses/low-level-design', 4.75, 234),

('API Design for Scale',
 'Design APIs that handle millions of requests. Learn API versioning, pagination, rate limiting, caching strategies, and API gateway patterns.',
 'System Design',
 '["API Design","Scalability","REST API","System Design","Backend","Performance"]',
 'Advanced', '["REST API Design","Backend Development","Databases"]',
 'https://learnova.local/courses/api-design-scale', 4.70, 167),

('Technical Interview Preparation: Data Structures & Algorithms',
 'Prepare systematically for technical coding interviews. Covers essential DSA patterns, problem-solving strategies, and 200+ curated problems with solutions.',
 'Interview Preparation',
 '["Interview Preparation","Data Structures","Algorithms","Problem Solving","Coding Interview","Technical Interview"]',
 'Intermediate', '["Data Structures","Algorithms","Programming Fundamentals"]',
 'https://learnova.local/courses/dsa-interview-prep', 4.80, 467),

('Behavioral Interview Mastery for Engineers',
 'Prepare compelling answers for behavioral interviews. Learn STAR method, leadership stories, conflict resolution narratives, and building a personal brand.',
 'Interview Preparation',
 '["Behavioral Interview","Interview Preparation","Communication","Career Development","Soft Skills"]',
 'Beginner', '[]',
 'https://learnova.local/courses/behavioral-interview', 4.40, 289),

('Career Roadmap: Becoming a Full-Stack Engineer',
 'Navigate your path to becoming a professional full-stack engineer. Learn industry expectations, portfolio building, job search strategies, and salary negotiation.',
 'Career Development',
 '["Full Stack","Career Development","Web Development","Portfolio","Job Search","Interview Preparation"]',
 'Beginner', '[]',
 'https://learnova.local/courses/fullstack-career', 4.50, 198);

-- ============================================================
-- SAMPLE RECOMMENDATIONS + RATINGS for demo users
-- ============================================================
-- Recommendation for student (user_id=2)
INSERT INTO recommendations (user_id, algorithm_version, is_personalized) VALUES
(2, 'TagOverlapStrategy-v1', 1),
(3, 'TagOverlapStrategy-v1', 1),
(4, 'PopularityStrategy-v1', 0);

-- Recommendation items for user 2 (recommendation_id=1)
INSERT INTO recommendation_items (recommendation_id, resource_id, `rank`, score, match_reason) VALUES
(1, 13, 1, 0.9200, 'Matches skills: JavaScript, HTML, CSS. Aligns with goal: Full Stack Developer'),
(1, 7,  2, 0.8800, 'Matches skills: Data Structures, Algorithms. High community rating.'),
(1, 36, 3, 0.8400, 'Matches skills: Python, SQL. Aligns with goal: Data Science'),
(1, 60, 4, 0.8100, 'Matches skills: Python, JavaScript. Aligns with goal: Backend Developer'),
(1, 59, 5, 0.7800, 'Aligns with goal: Full Stack Developer. Prerequisite: OOP satisfied.');

-- Recommendation items for user 3 (recommendation_id=2)
INSERT INTO recommendation_items (recommendation_id, resource_id, `rank`, score, match_reason) VALUES
(2, 36, 1, 0.9500, 'Matches skills: Python. Aligns with goal: Data Science'),
(2, 37, 2, 0.9100, 'Aligns with goal: Machine Learning. Matches skills: Python'),
(2, 7,  3, 0.8700, 'Matches skills: Algorithms. High technical match.'),
(2, 43, 4, 0.8200, 'Aligns with goal: Data Science. Matches skills: Python, SQL'),
(2, 42, 5, 0.7900, 'Aligns with goal: AI/ML. Prerequisite: Python satisfied.');

-- Recommendation items for user 4 (recommendation_id=3 - cold start)
INSERT INTO recommendation_items (recommendation_id, resource_id, `rank`, score, match_reason) VALUES
(3, 69, 1, 0.9500, 'Popular resource. Highly rated by community.'),
(3, 11, 2, 0.9200, 'Popular resource. Highly rated by community.'),
(3, 9,  3, 0.8900, 'Popular resource. Beginner-friendly.'),
(3, 1,  4, 0.8600, 'Popular resource. Highly rated by community.'),
(3, 61, 5, 0.8300, 'Popular resource. Well-reviewed by learners.');

-- Sample ratings
INSERT INTO ratings (user_id, resource_id, recommendation_item_id, rating) VALUES
(2, 13, 1, 5),
(2, 7,  2, 4),
(2, 36, 3, 5),
(3, 36, 6, 5),
(3, 37, 7, 4),
(4, 69, 11, 4);
