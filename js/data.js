/*
 * All of the site's content lives here. Edit this file to make the site yours;
 * you should not need to touch index.html to change text, projects or links.
 */
const SITE = {
  name: 'Donovan Ferrel',
  role: 'Software Engineer',

  // The hero types these out in turn. Remove all but one to stop the cycling.
  roles: ['Software Engineer', '.NET Developer', 'AI Agent Builder'],
  tagline: 'I build practical software for the people who have to use it, a habit I picked up from years on the help desk. These days I\'m exploring AI agents, automation and security.',

  // Adapted from the About and Experience sections of your LinkedIn profile.
  about: [
    'Hi, I\'m Donovan. I\'m a Software Engineer at Twin State Technical Services in Davenport, Iowa, where I\'ve been building web and desktop applications on .NET since 2023. I hold a B.S. in Computer Science from St. Ambrose University and have strong programming and data structure fundamentals.',
    'Before engineering, I spent most of my working life in customer service and IT support, including nearly five years on the St. Ambrose University service desk. It made me a better listener and guide: I\'m always looking for a chance to help someone get to the answer they came for.',
    'I spend a lot of my free time learning, through LeetCode, freeCodeCamp, TryHackMe, HackTheBox and CTF challenges. Lately that includes building AI agents and automations with Microsoft Copilot Studio, Power Automate and the Model Context Protocol.',
  ],

  // Daily-work groups first (your own picks), then things from your LinkedIn profile.
  // Each group is shown under its own heading.
  skills: [
    { group: '.NET & Back End', items: ['C#', '.NET 8+', '.NET Framework', 'ASP.NET Core Web API', 'ASP.NET MVC', 'Razor Pages'] },
    { group: 'Data', items: ['SQL Server', 'T-SQL', 'PetaPoco'] },
    { group: 'Front End & Desktop', items: ['Blazor', 'JavaScript', 'TypeScript', 'React', 'WPF', 'WinForms', 'HTML5', 'CSS'] },
    { group: 'Cloud & DevOps', items: ['Azure', 'Azure DevOps', 'CI/CD', 'Docker', 'Git', 'GitHub'] },
    { group: 'AI & Automation', items: ['AI Agents', 'MCP', 'Copilot Studio', 'Power Automate', 'Power Apps'] },
    { group: 'Also worked with', items: ['Python', 'Java', 'C/C++', 'Node.js', 'PostgreSQL', 'React Native', 'Kali Linux', 'Burp Suite'] },
  ],

  contactIntro: 'Have a project in mind, a question, or just want to say hello? Send me a message and I will get back to you.',

  // The "Portfolio contact" form in your Formspree account. Manage it at https://formspree.io/forms
  formEndpoint: 'https://formspree.io/f/xwlolovo',

  // Leave a url as '' to hide that link.
  links: [
    // `sprite` names a character in js/sprites.js; `bubble` is what it says when pointed at.
    { label: 'GitHub', url: 'https://github.com/V0ID12', sprite: 'bot', bubble: 'Read my code!' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/donovan-ferrel-29072b162', sprite: 'ghost', bubble: 'Let\'s connect!' },
  ],

  // The first project is shown first. `live` and `source` are optional.
  projects: [
    {
      title: 'Guess My Number',
      description: 'A mobile number guessing game where the phone tries to guess your number. Built with React Native and Expo, with separate start, game and game-over screens and reusable UI components.',
      tags: ['React Native', 'Expo', 'JavaScript'],
      live: '',
      source: 'https://github.com/V0ID12/RNGuessMyNumber',
    },
    {
      title: 'Coffee Browser',
      description: 'One Blazor UI, written once in a shared Razor class library and hosted by four apps: Blazor Server, .NET MAUI, WinForms and WPF. Each host plugs in its own data and auth services. Built alongside a Pluralsight course on Blazor Hybrid apps.',
      tags: ['C#', 'Blazor', '.NET MAUI', 'WPF'],
      live: '',
      source: 'https://github.com/V0ID12/CoffeeBrowser',
    },
    {
      title: 'PostgreSQL & Bash Projects',
      description: 'Six projects from the freeCodeCamp Relational Database certification, including a World Cup results database, a salon appointment scheduler and a bike rental shop, all driven by Bash scripts.',
      tags: ['PostgreSQL', 'Bash', 'SQL'],
      live: '',
      source: 'https://github.com/V0ID12?tab=repositories&q=FCC-',
    },
  ],
};
