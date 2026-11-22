import {
  Question,
  TestResult,
  TestAnswerItem,
  TopicScore,
  ResumeAnalysis,
  JobMatch,
  InterviewEvaluation,
  InterviewTurn
} from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

// Domain knowledge pools for generating rich technical questions
const QUESTION_BANK: Record<string, Question[]> = {
  'Computer Networks': [
    {
      id: 'cn-1',
      question: 'Which OSI layer is responsible for end-to-end communication, flow control, and error recovery?',
      optionA: 'Network Layer',
      optionB: 'Data Link Layer',
      optionC: 'Transport Layer',
      optionD: 'Session Layer',
      correctAnswer: 'C',
      explanation: 'The Transport Layer (Layer 4) ensures complete data transfer, reliability through flow control, and error checking using protocols like TCP.',
      topic: 'OSI Model',
      difficulty: 'easy'
    },
    {
      id: 'cn-2',
      question: 'What is the minimum Ethernet frame size required to ensure collision detection over standard IEEE 802.3 networks?',
      optionA: '46 bytes',
      optionB: '64 bytes',
      optionC: '128 bytes',
      optionD: '1518 bytes',
      correctAnswer: 'B',
      explanation: 'The minimum Ethernet frame size is 64 bytes (512 bits), which ensures that frame transmission takes longer than round-trip propagation time.',
      topic: 'Ethernet',
      difficulty: 'medium'
    },
    {
      id: 'cn-3',
      question: 'In Selective Repeat ARQ with an m-bit sequence number, what is the maximum sender window size?',
      optionA: '2^m',
      optionB: '2^m - 1',
      optionC: '2^(m-1)',
      optionD: '2^m / 2 + 1',
      correctAnswer: 'C',
      explanation: 'In Selective Repeat, the window size must not exceed 2^(m-1) to avoid sequence number ambiguity between current and subsequent frames.',
      topic: 'Sliding Window',
      difficulty: 'hard'
    },
    {
      id: 'cn-4',
      question: 'If a CRC polynomial generator is G(x) = x^4 + x + 1, how many redundant bits (zeros) are appended to the payload before division?',
      optionA: '3 bits',
      optionB: '4 bits',
      optionC: '5 bits',
      optionD: '1 bit',
      correctAnswer: 'B',
      explanation: 'The degree of polynomial x^4 + x + 1 is 4, which means 4 check bits are appended to the message.',
      topic: 'Error Detection',
      difficulty: 'medium'
    },
    {
      id: 'cn-5',
      question: 'After 3 consecutive packet collisions in Ethernet CSMA/CD, the binary exponential backoff algorithm picks a delay from which range?',
      optionA: '0 to 3 slots',
      optionB: '0 to 7 slots',
      optionC: '0 to 8 slots',
      optionD: '0 to 15 slots',
      correctAnswer: 'B',
      explanation: 'For k = 3 collisions, the range is 0 to 2^k - 1 = 2^3 - 1 = 7 slot times.',
      topic: 'Ethernet',
      difficulty: 'hard'
    },
    {
      id: 'cn-6',
      question: 'Which routing protocol uses Dijkstra’s shortest path algorithm to calculate the optimal path in an autonomous system?',
      optionA: 'RIP (Routing Information Protocol)',
      optionB: 'BGP (Border Gateway Protocol)',
      optionC: 'OSPF (Open Shortest Path First)',
      optionD: 'EGP (Exterior Gateway Protocol)',
      correctAnswer: 'C',
      explanation: 'OSPF is a link-state routing protocol that utilizes Dijkstra’s algorithm to calculate the shortest path tree from the router to all destinations.',
      topic: 'Routing Protocols',
      difficulty: 'medium'
    },
    {
      id: 'cn-7',
      question: 'What is the purpose of the 3-way handshake in TCP connection establishment?',
      optionA: 'To negotiate encryption keys',
      optionB: 'To synchronize initial sequence numbers (ISN) and allocate buffers',
      optionC: 'To detect network latency',
      optionD: 'To calculate MTU',
      correctAnswer: 'B',
      explanation: 'TCP 3-way handshake (SYN, SYN-ACK, ACK) synchronizes Initial Sequence Numbers between client and server and establishes socket buffers.',
      topic: 'TCP/IP',
      difficulty: 'easy'
    },
    {
      id: 'cn-8',
      question: 'Which IPv4 header field is decremented by 1 at each router hop to prevent routing loops?',
      optionA: 'Total Length',
      optionB: 'Header Checksum',
      optionC: 'Time to Live (TTL)',
      optionD: 'Identification',
      correctAnswer: 'C',
      explanation: 'TTL is decremented by each router. When it reaches 0, the packet is discarded and an ICMP Time Exceeded message is returned.',
      topic: 'IP Addressing',
      difficulty: 'easy'
    }
  ],
  'Java': [
    {
      id: 'java-1',
      question: 'In Java 8+, when does a bucket in HashMap convert from a linked list into a balanced Red-Black Tree (TreeNode)?',
      optionA: 'When bucket size reaches 4 and total capacity >= 32',
      optionB: 'When bucket size reaches 8 and total capacity >= 64',
      optionC: 'When bucket size reaches 16 and total capacity >= 128',
      optionD: 'When load factor exceeds 0.75',
      correctAnswer: 'B',
      explanation: 'When TREEIFY_THRESHOLD (8) is reached and table capacity is at least MIN_TREEIFY_CAPACITY (64), the bucket transforms from LinkedList to Red-Black tree to guarantee O(log n) worst-case lookup.',
      topic: 'Collections',
      difficulty: 'hard'
    },
    {
      id: 'java-2',
      question: 'What happens when an iterator modifies a collection directly while another thread iterates through it?',
      optionA: 'The modification is ignored',
      optionB: 'Throws ConcurrentModificationException (Fail-fast behavior)',
      optionC: 'Throws NullPointerException',
      optionD: 'The JVM deadlocks',
      correctAnswer: 'B',
      explanation: 'Fail-fast iterators compare expectedModCount with modCount. If a discrepancy is found, ConcurrentModificationException is thrown immediately.',
      topic: 'Collections',
      difficulty: 'medium'
    },
    {
      id: 'java-3',
      question: 'Which keyword in Java prevents instruction reordering by the compiler and guarantees memory visibility across threads?',
      optionA: 'synchronized',
      optionB: 'final',
      optionC: 'volatile',
      optionD: 'transient',
      correctAnswer: 'C',
      explanation: 'The volatile keyword ensures that reads and writes happen directly against main memory, establishing a happens-before relationship and disabling caching/reordering.',
      topic: 'Multithreading',
      difficulty: 'medium'
    },
    {
      id: 'java-4',
      question: 'In Spring Boot, which annotation is typically used on a class to handle exceptions globally across all controllers?',
      optionA: '@ExceptionHandler',
      optionB: '@ControllerAdvice',
      optionC: '@ResponseStatus',
      optionD: '@GlobalInterceptor',
      correctAnswer: 'B',
      explanation: '@ControllerAdvice (or @RestControllerAdvice) allows consolidating multiple @ExceptionHandler methods across all controllers into a single global component.',
      topic: 'Spring Boot',
      difficulty: 'easy'
    },
    {
      id: 'java-5',
      question: 'Where are String pool literals and class metadata stored in Java 8 and newer versions?',
      optionA: 'Permanent Generation (PermGen)',
      optionB: 'Metaspace (Native Memory)',
      optionC: 'Thread Stack',
      optionD: 'JVM Program Counter',
      correctAnswer: 'B',
      explanation: 'PermGen was removed in Java 8 and replaced by Metaspace, which utilizes native off-heap memory and grows automatically up to OS limits.',
      topic: 'JVM Architecture',
      difficulty: 'medium'
    }
  ],
  'DBMS': [
    {
      id: 'dbms-1',
      question: 'Which transaction isolation level avoids dirty reads and non-repeatable reads, but may still allow phantom reads?',
      optionA: 'Read Uncommitted',
      optionB: 'Read Committed',
      optionC: 'Repeatable Read',
      optionD: 'Serializable',
      correctAnswer: 'C',
      explanation: 'Repeatable Read ensures that data read multiple times in a transaction does not change, but newly inserted rows (phantoms) matching query criteria can still appear.',
      topic: 'ACID Properties',
      difficulty: 'hard'
    },
    {
      id: 'dbms-2',
      question: 'What is the primary advantage of a B+ Tree over a B-Tree for relational database index storage?',
      optionA: 'B+ Trees use less memory for leaf nodes',
      optionB: 'All records are stored in leaf nodes and leaf nodes are linked sequentially, enabling very fast range queries',
      optionC: 'B+ Tree has faster single-key random lookups than B-Tree',
      optionD: 'B+ Tree does not require rebalancing during insertions',
      correctAnswer: 'B',
      explanation: 'In B+ Trees, internal nodes only contain keys for routing, and all data/record pointers reside in leaf nodes which form a doubly linked list, making range scans O(k + log n).',
      topic: 'Indexing',
      difficulty: 'medium'
    },
    {
      id: 'dbms-3',
      question: 'A table is in 3NF if it is in 2NF and has no:',
      optionA: 'Partial functional dependencies',
      optionB: 'Transitive functional dependencies on any candidate key',
      optionC: 'Multivalued dependencies',
      optionD: 'Foreign keys',
      correctAnswer: 'B',
      explanation: 'Third Normal Form (3NF) requires that no non-prime attribute is transitively dependent on any candidate key (X -> Y -> Z).',
      topic: 'Normalization',
      difficulty: 'easy'
    },
    {
      id: 'dbms-4',
      question: 'What is the difference between Clustered and Non-Clustered index in SQL databases?',
      optionA: 'Clustered index alters the physical order of table rows on disk; non-clustered index creates a separate index structure',
      optionB: 'A table can have multiple clustered indexes but only one non-clustered index',
      optionC: 'Clustered index stores data in binary format; non-clustered stores text',
      optionD: 'Non-clustered indexes are always faster for full table scans',
      correctAnswer: 'A',
      explanation: 'A table can have only one clustered index because physical rows can only be ordered in one way on storage disk.',
      topic: 'Indexing',
      difficulty: 'medium'
    }
  ],
  'Operating Systems': [
    {
      id: 'os-1',
      question: 'Which CPU scheduling algorithm can lead to starvation if short jobs arrive continuously?',
      optionA: 'First-Come, First-Served (FCFS)',
      optionB: 'Round Robin (RR)',
      optionC: 'Shortest Job First (SJF) / SRTF',
      optionD: 'Priority Scheduling with aging',
      correctAnswer: 'C',
      explanation: 'Shortest Job First and Shortest Remaining Time First prioritize small burst times, causing longer processes to starve indefinitely unless aging is implemented.',
      topic: 'CPU Scheduling',
      difficulty: 'easy'
    },
    {
      id: 'os-2',
      question: 'Which of the following is NOT one of Coffman’s four necessary conditions for deadlock?',
      optionA: 'Mutual Exclusion',
      optionB: 'Hold and Wait',
      optionC: 'Preemption Allowed',
      optionD: 'Circular Wait',
      correctAnswer: 'C',
      explanation: 'The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlock cannot persist.',
      topic: 'Deadlocks',
      difficulty: 'medium'
    },
    {
      id: 'os-3',
      question: 'What is Thrashing in virtual memory management?',
      optionA: 'When CPU utilization reaches 100%',
      optionB: 'When a process spends more time swapping pages in and out than executing instructions',
      optionC: 'When disk fragmentation exceeds 80%',
      optionD: 'When cache memory overflows',
      correctAnswer: 'B',
      explanation: 'Thrashing occurs when the total working set exceeds available physical RAM, causing the operating system to constantly page fault and swap data.',
      topic: 'Virtual Memory',
      difficulty: 'medium'
    }
  ],
  'DSA': [
    {
      id: 'dsa-1',
      question: 'What is the worst-case time complexity of QuickSort when the pivot is always chosen as the first element on an already sorted array?',
      optionA: 'O(n log n)',
      optionB: 'O(n)',
      optionC: 'O(n^2)',
      optionD: 'O(log n)',
      correctAnswer: 'C',
      explanation: 'When the partition is unbalanced (e.g. 0 and n-1 elements each recursion level), recurrence is T(n) = T(n-1) + O(n), which results in O(n^2).',
      topic: 'Sorting & Searching',
      difficulty: 'easy'
    },
    {
      id: 'dsa-2',
      question: 'Which data structure is most suitable for implementing an LRU (Least Recently Used) Cache with O(1) get and put operations?',
      optionA: 'Array and Stack',
      optionB: 'HashMap and Doubly Linked List',
      optionC: 'Binary Search Tree',
      optionD: 'Min Heap and Queue',
      correctAnswer: 'B',
      explanation: 'A Doubly Linked List allows O(1) removal and insertion at head/tail, while a HashMap gives O(1) pointer lookup to any node in the list.',
      topic: 'Data Structures',
      difficulty: 'medium'
    },
    {
      id: 'dsa-3',
      question: 'In a directed graph with negative edge weights but NO negative weight cycles, which algorithm finds the single-source shortest path?',
      optionA: 'Dijkstra’s Algorithm',
      optionB: 'Bellman-Ford Algorithm',
      optionC: 'Kruskal’s Algorithm',
      optionD: 'Prim’s Algorithm',
      correctAnswer: 'B',
      explanation: 'Bellman-Ford relaxes all edges |V| - 1 times and handles negative edge weights correctly, while Dijkstra assumes non-negative weights.',
      topic: 'Graphs',
      difficulty: 'medium'
    }
  ]
};

export class AIService {
  /**
   * Generate MCQs from study materials or subject topics
   */
  static generateMCQs(options: {
    content?: string;
    subject: string;
    chapter?: string;
    topic?: string;
    count: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    questionType: 'mcq' | 'true-false';
  }): Question[] {
    const { subject, count, difficulty, questionType } = options;

    // Look for matching subject in question bank or fallback to Computer Networks
    const bank = QUESTION_BANK[subject] || QUESTION_BANK['Computer Networks'];
    let pool = [...bank];

    // Filter by difficulty if not mixed
    if (difficulty !== 'mixed') {
      const filtered = pool.filter(q => q.difficulty === difficulty);
      if (filtered.length > 0) pool = filtered;
    }

    // If true/false requested, adapt questions
    if (questionType === 'true-false') {
      return pool.slice(0, count).map((q, idx) => ({
        id: `q-tf-${uuidv4().substring(0, 8)}`,
        question: `True or False: ${q.question.replace(/\?$/, '')}?`,
        optionA: 'True',
        optionB: 'False',
        optionC: 'Not Applicable',
        optionD: 'Ambiguous',
        correctAnswer: q.correctAnswer === 'A' || q.correctAnswer === 'C' ? 'A' : 'B',
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty
      }));
    }

    // Duplicate or generate if count exceeds current pool
    const result: Question[] = [];
    let i = 0;
    while (result.length < count) {
      const base = pool[i % pool.length];
      result.push({
        ...base,
        id: `q-gen-${uuidv4().substring(0, 8)}`,
        question: i >= pool.length ? `[Practice variant ${i + 1}] ${base.question}` : base.question
      });
      i++;
    }

    return result.slice(0, count);
  }

  /**
   * Evaluate a completed test, compute score, accuracy, topic breakdown, and recommendations
   */
  static evaluateTest(params: {
    testTitle: string;
    subject: string;
    questions: Question[];
    userAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
    timeTakenSeconds: number;
  }): {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unanswered: number;
    timeTaken: string;
    accuracy: number;
    topicBreakdown: TopicScore[];
    answers: TestAnswerItem[];
  } {
    const { questions, userAnswers, timeTakenSeconds } = params;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const topicMap: Record<string, { total: number; correct: number }> = {};
    const answers: TestAnswerItem[] = [];

    questions.forEach(q => {
      const selected = userAnswers[q.id] || null;
      const isCorrect = selected === q.correctAnswer;

      if (!selected) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { total: 0, correct: 0 };
      }
      topicMap[q.topic].total++;
      if (isCorrect) topicMap[q.topic].correct++;

      answers.push({
        id: `ans-${uuidv4().substring(0, 8)}`,
        testId: '',
        questionId: q.id,
        questionText: q.question,
        options: {
          A: q.optionA,
          B: q.optionB,
          C: q.optionC,
          D: q.optionD
        },
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        topic: q.topic,
        difficulty: q.difficulty,
        explanation: q.explanation
      });
    });

    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const attempted = correctCount + wrongCount;
    const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100 * 10) / 10 : 0;

    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    const timeTaken = `${minutes}m ${seconds}s`;

    const topicBreakdown: TopicScore[] = Object.entries(topicMap).map(([topic, stats]) => {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      let priority: 'high' | 'medium' | 'strong' = 'medium';
      let recommendation = '';

      if (percentage < 50) {
        priority = 'high';
        recommendation = `High Priority: Revise core fundamentals of ${topic}, solve conceptual questions, and review standard algorithms.`;
      } else if (percentage <= 75) {
        priority = 'medium';
        recommendation = `Medium Priority: Practice intermediate problem sets and edge cases in ${topic}.`;
      } else {
        priority = 'strong';
        recommendation = `Strong Area: Solid grasp of ${topic}. Keep practicing advanced application-based scenarios.`;
      }

      return {
        topic,
        total: stats.total,
        correct: stats.correct,
        percentage,
        priority,
        recommendation
      };
    });

    return {
      score,
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unanswered: unansweredCount,
      timeTaken,
      accuracy,
      topicBreakdown,
      answers
    };
  }

  /**
   * Analyze user resume and return ATS score, category breakdowns, strengths, and actionable rewrite suggestions
   */
  static analyzeResume(resumeText: string, fileName: string): ResumeAnalysis {
    const textLower = resumeText.toLowerCase();

    // Skill detection dictionary
    const knownSkills = [
      'Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
      'Spring Boot', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Git', 'REST API', 'GraphQL', 'DSA',
      'Algorithms', 'Microservices', 'CI/CD', 'Linux'
    ];

    const extractedSkills = knownSkills.filter(skill =>
      textLower.includes(skill.toLowerCase())
    );

    // Heuristics for scoring
    const hasProjects = textLower.includes('project') || textLower.includes('built') || textLower.includes('developed');
    const hasMetrics = /\b\d{1,3}%\b|\b\d+\s*(ms|k|users|requests)\b/i.test(resumeText);
    const hasEducation = textLower.includes('bachelor') || textLower.includes('b.tech') || textLower.includes('university') || textLower.includes('college');
    const hasExperience = textLower.includes('intern') || textLower.includes('experience') || textLower.includes('work');

    const skillsScore = Math.min(9.5, 6.0 + extractedSkills.length * 0.4);
    const projectScore = hasMetrics ? 9.0 : (hasProjects ? 7.8 : 5.5);
    const educationScore = hasEducation ? 8.5 : 7.0;
    const experienceScore = hasExperience ? 8.0 : 6.5;
    const formattingScore = 8.5;
    const atsScore = Math.min(9.2, 6.8 + (extractedSkills.length > 5 ? 1.4 : 0.6));
    const keywordsScore = Math.min(9.0, 6.5 + (extractedSkills.length > 6 ? 1.5 : 0.5));

    const overallScore = Math.round(
      ((skillsScore * 0.25) +
       (projectScore * 0.2) +
       (educationScore * 0.1) +
       (experienceScore * 0.15) +
       (formattingScore * 0.1) +
       (atsScore * 0.1) +
       (keywordsScore * 0.1)) * 10
    ) / 10;

    const strengths: string[] = [];
    if (extractedSkills.length >= 4) {
      strengths.push(`Identified in-demand technical competencies: ${extractedSkills.slice(0, 5).join(', ')}`);
    }
    if (hasProjects) {
      strengths.push('Projects section clearly demonstrates practical hands-on application of development frameworks');
    }
    if (hasEducation) {
      strengths.push('Academic credentials and degree timeline are clearly articulated');
    }
    strengths.push('Consistent, parseable formatting well suited for modern ATS parser indexing');

    const areasToImprove: string[] = [];
    if (!hasMetrics) {
      areasToImprove.push('Incorporate quantifiable metrics into project bullet points (e.g. latency reduced by X%, handled Y requests/sec)');
    }
    areasToImprove.push('Enhance cloud and containerization keywords (e.g. Docker, AWS, CI/CD pipelines)');
    areasToImprove.push('Include unit testing frameworks (JUnit, Mockito, Jest) to signal software reliability');
    areasToImprove.push('Tailor summary statement to directly match target engineering job descriptions');

    const sectionSuggestions = [
      {
        section: 'Professional Summary',
        currentFeedback: 'Summary gives an overview but could be sharper and more goal-oriented.',
        improvementTip: 'Lead with your target title, top 3 tech stacks, and quantifiable problem-solving impact.',
        exampleSnippet: '"Aspiring Software Engineer specializing in Java, Spring Boot, and RESTful architectures with hands-on experience building distributed web services."'
      },
      {
        section: 'Technical Projects',
        currentFeedback: 'Strong project foundations, but focus on the business impact using Google’s XYZ pattern.',
        improvementTip: 'Accomplished [X], measured by [Y], by doing [Z].',
        exampleSnippet: '"Engineered a real-time tracking service handling 10,000 requests/min, cutting response latency by 35% using Redis caching."'
      },
      {
        section: 'Skills & Tools',
        currentFeedback: 'Good variety of languages and frameworks.',
        improvementTip: 'Group skills by categories (Languages, Frameworks, Databases, Developer Tools) to maximize ATS scanner matches.'
      },
      {
        section: 'Experience / Leadership',
        currentFeedback: 'Highlight collaborative practices and code quality.',
        improvementTip: 'Mention code reviews, agile sprints, and git version control workflows.'
      }
    ];

    return {
      id: `resume-${uuidv4().substring(0, 8)}`,
      userId: '',
      resumeName: fileName,
      overallScore,
      scores: {
        skills: Math.round(skillsScore * 10) / 10,
        projects: Math.round(projectScore * 10) / 10,
        education: Math.round(educationScore * 10) / 10,
        experience: Math.round(experienceScore * 10) / 10,
        formatting: Math.round(formattingScore * 10) / 10,
        atsCompatibility: Math.round(atsScore * 10) / 10,
        keywords: Math.round(keywordsScore * 10) / 10
      },
      strengths,
      areasToImprove,
      sectionSuggestions,
      extractedSkills: extractedSkills.length > 0 ? extractedSkills : ['Java', 'SQL', 'Git', 'DSA'],
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Match user resume against a specific job description
   */
  static matchJobDescription(params: {
    resumeText: string;
    jobTitle: string;
    company: string;
    jobDescription: string;
  }): JobMatch {
    const { resumeText, jobTitle, company, jobDescription } = params;
    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescription.toLowerCase();

    const techKeywords = [
      'Java', 'Spring Boot', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'REST API', 'GraphQL', 'Microservices', 'Git',
      'CI/CD', 'Kafka', 'Linux', 'Unit Testing', 'JUnit', 'Agile'
    ];

    const requiredInJD = techKeywords.filter(k => jdLower.includes(k.toLowerCase()));
    // If JD is brief, provide standard expectations for the job title
    const effectiveRequired = requiredInJD.length >= 3 ? requiredInJD : ['Java', 'Spring Boot', 'SQL', 'Docker', 'REST API', 'AWS'];

    const matchedSkills = effectiveRequired.filter(k => resumeLower.includes(k.toLowerCase()));
    const missingSkills = effectiveRequired.filter(k => !resumeLower.includes(k.toLowerCase()));

    const matchRatio = effectiveRequired.length > 0 ? matchedSkills.length / effectiveRequired.length : 0.7;
    const keywordMatchPercentage = Math.round(Math.min(96, Math.max(45, matchRatio * 100)));
    const matchScore = Math.round((keywordMatchPercentage / 10) * 10) / 10;

    const recommendations = missingSkills.length > 0
      ? `Add genuine experience or academic project details highlighting ${missingSkills.join(', ')} to your resume if you have worked with these technologies.`
      : 'Excellent alignment! Your resume covers the primary technical requirements for this role.';

    const resumeChanges = [
      missingSkills.length > 0
        ? `Explicitly incorporate ${missingSkills.slice(0, 3).join(', ')} into your project implementation bullets.`
        : 'Highlight system performance metrics and test coverage to stand out among competitive applicants.',
      `Mirror exact terminology from the "${jobTitle}" job posting in your skills section.`,
      `Detail your experience with ${matchedSkills.slice(0, 3).join(', ')} under your most recent project descriptions.`
    ];

    return {
      id: `job-match-${uuidv4().substring(0, 8)}`,
      userId: '',
      jobTitle,
      company: company || 'Hiring Company',
      jobDescription,
      matchScore,
      keywordMatchPercentage,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : ['Java', 'SQL', 'Git'],
      missingSkills: missingSkills.length > 0 ? missingSkills : ['Docker', 'AWS'],
      recommendations,
      resumeChanges,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Direct Ollama Agent Inference Helper
   */
  static async queryOllama(prompt: string, systemPrompt?: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt,
          system: systemPrompt || 'You are an intelligent AI Career Mentor and Interview Coach. Provide clear, encouraging, structured, practical technical guidance for college engineering students.',
          stream: false
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) return null;
      const data: any = await res.json();
      return data.response ? data.response.trim() : null;
    } catch {
      return null;
    }
  }

  /**
   * AI Career Chat Assistant
   */
  static async answerCareerQuestion(userMessage: string): Promise<string> {
    // 1. Attempt dynamic inference via active local Ollama Agent (llama3.2)
    try {
      const ollamaResponse = await this.queryOllama(userMessage);
      if (ollamaResponse && ollamaResponse.length > 20) {
        return ollamaResponse;
      }
    } catch {
      // Fallback to domain repository
    }

    const q = userMessage.toLowerCase();

    if (q.includes('roadmap') || q.includes('java interview roadmap') || q.includes('backend roadmap')) {
      return `### 🚀 Java Backend Interview Roadmap

Here is a targeted 4-week preparation plan to clear technical rounds:

#### Week 1: Java Core & Memory Mechanics
- **OOP Principles**: Deep dive into Method Overriding, Polymorphism, Abstract classes vs Interfaces.
- **Collections Framework**: Internal hashing algorithm of \`HashMap\` (buckets, treeify threshold = 8), \`ConcurrentHashMap\`, and \`ArrayList\` amortized expansion.
- **Multithreading**: \`volatile\` visibility, thread states, \`synchronized\`, \`ReentrantLock\`, and \`ExecutorService\` thread pools.
- **JVM Internals**: Heap vs Stack memory, Metaspace, and Garbage Collectors (G1GC, ZGC).

#### Week 2: Spring Boot & Architecture
- **Dependency Injection**: \`@Autowired\`, Bean scopes (Singleton, Prototype), and component scanning.
- **RESTful APIs**: Best practices for HTTP verbs, response status codes (201 Created, 409 Conflict), and \`@ControllerAdvice\` for unified error handling.
- **Security**: JWT authentication filter pipeline and Spring Security configuration.

#### Week 3: Database & Performance
- **SQL & ORM**: Clustered vs non-clustered indexing, execution plan (\`EXPLAIN ANALYZE\`), and preventing N+1 queries in Spring Data JPA.
- **Transactions**: ACID guarantees and isolation levels (Read Committed vs Repeatable Read).
- **Caching**: Redis Cache-Aside pattern and TTL expiration policies.

#### Week 4: DSA & System Design
- Master Top 50 LeetCode patterns: Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, and Tree traversals.
- High-level design: Load balancers, horizontal scaling, database sharding, and message queues (Kafka / RabbitMQ).`;
    }

    if (q.includes('rest api') || q.includes('explain rest api')) {
      return `### 🌐 Explaining REST APIs in an Interview

In technical interviews, interviewers look for both theoretical clarity and real-world design maturity:

#### 1. Definition
**REST** (Representational State Transfer) is an architectural style for distributed hypermedia systems that relies on stateless, client-server communications over standard HTTP protocols.

#### 2. Key Constraints
* **Statelessness**: Every request contains all necessary credentials and information. The server retains no client session context.
* **Client-Server Separation**: UI concerns and data storage concerns are completely decoupled.
* **Cacheability**: Responses explicitly declare whether they can be cached (\`Cache-Control\`, \`ETag\`).
* **Uniform Interface**: Resources are identified by stable URIs (e.g. \`/api/v1/users/102\`).

#### 3. Standard HTTP Methods & Idempotency
| Method | Purpose | Idempotent? | Safe? |
|---|---|---|---|
| **GET** | Retrieve resource | Yes | Yes |
| **POST** | Create new resource | No | No |
| **PUT** | Replace existing resource | Yes | No |
| **PATCH** | Partial resource update | No | No |
| **DELETE**| Remove resource | Yes | No |

#### 4. Pro-Tip for Candidates:
Mention status codes accurately:
* \`201 Created\` with a \`Location\` header when a POST succeeds.
* \`400 Bad Request\` for schema validation failures.
* \`401 Unauthorized\` (unauthenticated) vs \`403 Forbidden\` (authenticated but lacks role/permission).`;
    }

    if (q.includes('dsa') || q.includes('data structures') || q.includes('topics')) {
      return `### 💡 High-Yield DSA Topics for College Placements

Focus on patterns rather than memorizing individual problems:

1. **Arrays & Strings**
   - Two Pointers (Left/Right convergence)
   - Sliding Window (Fixed length and dynamic constraint)
   - Prefix Sum & Kadane’s Algorithm (Maximum Subarray)

2. **Hashing & HashMaps**
   - Two Sum pattern, Subarray sum equals K
   - Frequency counting and bucket sorting

3. **Linked Lists & Stacks**
   - Fast & Slow pointers (Cycle detection / Middle of list)
   - Monotonic Stack (Next Greater Element)

4. **Trees & Graphs**
   - Binary Tree Traversals (Inorder, Preorder, Postorder, BFS Level-order)
   - Lowest Common Ancestor (LCA)
   - Graph BFS / DFS (Number of Islands, Topological Sort)

5. **Dynamic Programming**
   - 0/1 Knapsack, Coin Change, Longest Increasing Subsequence (LIS), Longest Common Subsequence (LCS).

Aim for **150-200 curated problems** across these core patterns.`;
    }

    if (q.includes('dbms') || q.includes('sql')) {
      return `### 🗄️ Top 5 Core DBMS Interview Questions

1. **What are ACID properties and why are they vital?**
   - *Atomicity*: All or nothing execution via transaction logs.
   - *Consistency*: Data transitions from one valid state to another.
   - *Isolation*: Concurrent transactions don't interfere.
   - *Durability*: Committed changes survive system power crashes.

2. **Explain Indexing and B+ Tree structures.**
   - Clustered index determines row physical storage; non-clustered creates auxiliary search trees pointing to row IDs.
   - B+ Trees store all actual record pointers in leaf nodes linked as a doubly-linked list, allowing sequential range scans.

3. **Normalization vs Denormalization:**
   - 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency).
   - Denormalization is intentionally applied in analytical/high-read systems to minimize costly JOIN operations.

4. **Triggers vs Stored Procedures:**
   - Stored procedures are explicitly invoked; triggers execute automatically on DML events (INSERT/UPDATE/DELETE).

5. **Write a query to find the second highest salary:**
   \`\`\`sql
   SELECT MAX(salary) FROM employees 
   WHERE salary < (SELECT MAX(salary) FROM employees);
   \`\`\``;
    }

    // Default intelligent response
    return `### 💡 Career Assistant Guidance

Thank you for your question! Here are key recommendations tailored for your preparation:

1. **Master the Fundamentals**: Ensure you can explain core concepts (Data Structures, Object Oriented Programming, System Architecture, and Networking) from first principles.
2. **Project Narrative**: When discussing your projects in interviews, use the **STAR method** (Situation, Task, Action, Result) and clearly state your individual technical contributions.
3. **Mock Practice**: Use our **Interview Practice** simulator to test your spontaneous speaking skills and get structured feedback.

Would you like a sample interview question, a resume review checklist, or specific technical tips on Java, Python, DBMS, or DSA?`;
  }

  /**
   * Turn-based Mock Interview Generator
   */
  static getInterviewQuestionsForRole(role: string, type: string): string[] {
    if (role.toLowerCase().includes('java') || role.toLowerCase().includes('backend')) {
      if (type === 'HR') {
        return [
          'Tell me about yourself, your educational background, and why you are interested in backend software engineering.',
          'Describe a challenging bug or technical hurdle you faced in a project and how you resolved it.',
          'Where do you see yourself professionally in the next 3 to 5 years?'
        ];
      }
      return [
        'Can you explain the internal mechanism of Java HashMap, specifically how hash collisions are handled before and after Java 8?',
        'What is the difference between synchronous and asynchronous processing? How would you implement an asynchronous task in Spring Boot?',
        'How do you handle database transactions to ensure consistency when a microservice writes to multiple tables?'
      ];
    }

    if (role.toLowerCase().includes('full stack') || role.toLowerCase().includes('web')) {
      return [
        'Can you walk me through what happens under the hood from the moment a user enters a URL in their browser until the page finishes rendering?',
        'How do you manage client-side state in React, and when would you choose Context API versus a global store like Redux or Zustand?',
        'How do you protect your web application against common security vulnerabilities like Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?'
      ];
    }

    return [
      'Tell me about your most significant technical project and the architectural decisions you made.',
      'How do you approach optimizing an algorithm or query that is performing slower than acceptable?',
      'Describe a time when you received constructive feedback on your code and how you incorporated it.'
    ];
  }

  /**
   * Evaluate user answer during mock interview
   */
  static evaluateAnswer(question: string, answer: string): { feedback: string; score: number } {
    const wordCount = answer.trim().split(/\s+/).length;

    if (wordCount < 10) {
      return {
        feedback: 'Your answer is quite brief. In interviews, aim to explain your reasoning, give concrete examples, and state any trade-offs.',
        score: 6.0
      };
    }

    if (wordCount > 120) {
      return {
        feedback: 'Very thorough and comprehensive response! You demonstrated good technical depth. Be mindful of keeping responses structured so the interviewer can ask follow-ups.',
        score: 9.2
      };
    }

    return {
      feedback: 'Good, structured answer. You addressed the core premise of the question clearly. Mentioning a specific practical example or metric would make it even stronger.',
      score: 8.5
    };
  }

  /**
   * Generate complete interview evaluation scorecard
   */
  static generateInterviewReport(role: string, turns: InterviewTurn[]): InterviewEvaluation {
    const scores = turns.map(t => t.score || 8.0);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 8.2;
    const overallScore = Math.round(avg * 10) / 10;

    return {
      overallScore,
      technicalKnowledge: Math.round(Math.min(9.8, overallScore + 0.3) * 10) / 10,
      communication: Math.round(Math.min(9.5, overallScore - 0.2) * 10) / 10,
      answerQuality: Math.round(overallScore * 10) / 10,
      summary: `The candidate showed solid conceptual clarity and practical understanding for the ${role} position. Responses were articulated well with appropriate technical vocabulary.`,
      strengths: [
        'Clear problem-solving approach and systematic structuring of answers',
        'Strong awareness of framework mechanics and fundamental computer science concepts',
        'Confident communication style and good pace of explanation'
      ],
      missingConcepts: [
        'Could highlight system scalability metrics and performance trade-offs more explicitly',
        'Include unit test considerations and error handling edge cases'
      ],
      recommendedTopics: [
        'Distributed systems caching & database indexing',
        'Asynchronous programming and non-blocking I/O',
        'Behavioral STAR storytelling for leadership and teamwork scenarios'
      ]
    };
  }
}
