# Torus AI - Project Documentation

---

## 1. Problem Statement

### The Challenge
Developers and teams face significant friction when starting new projects:

1. **Tech Stack Paralysis**: Choosing the right combination of frontend, backend, database, and infrastructure is overwhelming. Too many options exist, and selecting the wrong combination early can derail the entire project.

2. **Knowledge Gap**: Not all developers are experts in every technology. Finding the optimal tech stack for specific project requirements requires extensive research and industry knowledge.

3. **Manual Planning**: Creating detailed project architectures, feature breakdowns, and implementation strategies requires hours of manual planning and documentation.

4. **Lack of Actionable Guidance**: General project plans don't translate into actual implementation. Developers need specific, phase-by-phase prompts and instructions to begin coding.

5. **Time to Market**: The lengthy planning phase delays actual development. Teams waste days or weeks deliberating on technical decisions before writing a single line of code.

6. **Cost Barriers**: Existing AI planning tools charge monthly subscriptions, making them inaccessible for indie developers, startups, and hobbyists.

### Target Users
- **Indie developers** starting solo projects
- **Startup teams** building MVPs with limited resources
- **Full-stack developers** seeking comprehensive guidance
- **Students and learners** wanting to understand best practices
- **Enterprises** needing rapid prototyping and architecture validation

---

## 2. Problem Solution

### The Torus AI Approach

Torus AI provides an **AI-powered project planning platform** that transforms project ideas into detailed, executable architectures with zero cost.

#### Core Solution Components:

1. **Intelligent Idea Analysis**
   - Users describe their project idea in natural language
   - Groq AI (Llama 3.3 70B) analyzes requirements and context

2. **Live Tech Stack Research**
   - 5 parallel SearXNG searches fetch current best practices
   - Searches cover: frontend, backend, database, authentication, AI services
   - Real-time web data ensures recommendations stay current

3. **AI-Driven Architecture Generation**
   - Groq synthesizes search results and generates optimal tech stack
   - Creates detailed 7-phase build plan with milestones
   - Breaks down project into feature modules and components

4. **Phase-Based Implementation Guidance**
   - Generates specific prompts for each build phase
   - Tailored for popular tools: Cursor, Windsurf, Bolt.new
   - Copy-paste ready for immediate development

5. **Visual Architecture Representation**
   - Renders interactive system diagrams showing component relationships
   - Helps teams understand data flow and dependencies
   - Supports collaborative planning and stakeholder communication

6. **Zero-Cost Infrastructure**
   - Runs entirely on free-tier services
   - No vendor lock-in or hidden costs
   - Self-hosted or easily deployable to Vercel

---

## 3. Functional Requirements

### FR1: User Authentication & Authorization
- Users can create accounts via email/password or OAuth
- Secure session management using Supabase Auth
- Role-based access control (User, Organization Admin, Super Admin)
- Password reset and email verification

### FR2: Project Creation & Idea Input
- Users input project description, goals, and constraints
- Support for text-based idea submission
- Store project metadata (name, description, date created, status)
- Track project versions and iterations

### FR3: AI-Powered Tech Stack Recommendation
- Submit project idea to recommendation engine
- Integration with live web search (SearXNG) for current best practices
- Use Groq LLM to analyze and recommend optimal tech stack
- Display recommended technologies with reasoning
- Support fallback to alternative AI models (Google Gemini)

### FR4: Feature Generation & Management
- Auto-generate list of core features based on project description
- Allow users to add, edit, or remove features
- Group features by category (Frontend, Backend, Infrastructure)
- Prioritize features (must-have, nice-to-have, future)
- Store feature relationships and dependencies

### FR5: Architecture Visualization
- Generate interactive system architecture diagrams
- Display component relationships and data flow
- Show technology stack layers (UI, API, Database)
- Export architecture as image or PDF
- Edit and customize architecture nodes

### FR6: Phase-Based Planning
- Generate 7-phase implementation roadmap
- Define milestones and deliverables for each phase
- Estimate duration and complexity per phase
- Track phase completion and progress
- Support parallel phases and dependencies

### FR7: Prompt Generation for Development
- Generate LLM-ready prompts for each development phase
- Customize prompts based on selected tools (Cursor, Windsurf, Bolt.new)
- Include code examples and implementation patterns
- Support prompt versioning and history
- Copy-to-clipboard functionality

### FR8: Error Fixing Assistant
- Accept error messages and stack traces from users
- Analyze errors using Groq AI with project context
- Generate troubleshooting steps and solutions
- Link solutions to relevant documentation

### FR9: Tool Hub
- Provide 18+ standalone development tools
- Include tools for API design, database modeling, code generation
- One-click access from dashboard
- Integrate tools into project workflows

### FR10: Dashboard & Analytics
- Display user projects and recent activities
- Show project statistics (features, phases, team size)
- Project timeline and progress tracking
- User achievement badges and milestones
- Search and filter projects

### FR11: Team & Collaboration (Optional Enhancement)
- Support multi-user team projects
- Role assignment and permission management
- Team workflow and communication within projects
- Comments and annotations on architectures
- Shared project spaces

### FR12: Data Persistence
- Save all projects, features, phases, and prompts to database
- Support project export (JSON, PDF, Markdown)
- Version control for project iterations
- Backup and recovery mechanisms

---

## 4. Non-Functional Requirements

### NFR1: Performance
- **Response Time**: AI recommendations generated within 30 seconds
- **Page Load**: UI pages load within 2 seconds
- **Search**: Web searches complete within 15 seconds
- **Database Queries**: Complete within 500ms
- **Concurrent Users**: Support 1000+ concurrent users

### NFR2: Scalability
- **Horizontal Scaling**: Stateless backend for easy scaling
- **Database**: Handle 1M+ projects and 10M+ features
- **API Rate Limiting**: Graceful handling of Groq/SearXNG rate limits
- **Load Balancing**: Distribute traffic across multiple instances

### NFR3: Availability & Reliability
- **Uptime SLA**: 99.5% availability
- **Fallback Mechanisms**: Alternative AI models when primary fails
- **Error Handling**: Graceful degradation with fallback search results
- **Data Redundancy**: Automatic backups and disaster recovery

### NFR4: Security
- **Authentication**: OAuth 2.0 and JWT tokens
- **Encryption**: TLS for data in transit, encryption at rest
- **API Security**: Rate limiting, input validation, SQL injection prevention
- **Data Privacy**: GDPR compliant, user data isolation
- **Secret Management**: Secure environment variable handling

### NFR5: Maintainability
- **Code Quality**: TypeScript for type safety
- **Documentation**: Comprehensive inline comments and API docs
- **Testing**: Unit tests for critical functions
- **Monitoring**: Error tracking and performance monitoring
- **Version Control**: Clean git history with meaningful commits

### NFR6: Usability
- **UI/UX**: Intuitive navigation and clear information hierarchy
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile, tablet, and desktop support
- **Onboarding**: Interactive tutorial for new users
- **Help Documentation**: Contextual help and FAQ

### NFR7: Cost Efficiency
- **Zero Operational Cost**: Run entirely on free-tier services
- **Resource Optimization**: Minimize API calls and compute usage
- **Infrastructure**: Self-hosted or Vercel deployment options

---

## 5. Technologies Used

### Frontend Stack
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js 14** | React framework with App Router | 14.2.5 |
| **React 18** | UI component library | 18.x |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **Tailwind CSS** | Utility-first CSS framework | 3.4.1 |
| **Lucide React** | Icon library | 0.441.0 |
| **ReactFlow** | Interactive diagram library | 11.11.4 |
| **Recharts** | Data visualization library | 2.12.7 |
| **html2canvas** | HTML to image conversion | 1.4.1 |
| **jsPDF** | PDF generation | 2.5.1 |

### Backend & AI Stack
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Groq API** | LLM inference (Llama 3.3 70B) | Latest |
| **Google Gemini** | Fallback AI model | Flash version |
| **SearXNG** | Open-source metasearch engine | Latest |

### Database & Authentication
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Supabase** | PostgreSQL + Auth + Real-time | Latest |
| **PostgreSQL** | Relational database | 15+ |
| **Firebase** | Alternative auth provider | 12.13.0 |

### Infrastructure & Deployment
| Technology | Purpose |
|-----------|---------|
| **Vercel** | Production hosting & CDN |
| **Railway** | SearXNG hosting (optional) |
| **Docker** | SearXNG containerization |

### Development Tools
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **npm** | Package manager |
| **Git** | Version control |

---

## 6. System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Browser)                  │
├──────────────────────────────────────────────────────────────────┤
│  • Landing Page                                                  │
│  • Auth Pages (Login/Signup)                                     │
│  • Dashboard (Project Overview)                                  │
│  • Planner Pages (Multi-step wizard)                             │
│  • Tool Hub & Error Fix Assistant                                │
│  • Team Collaboration Interface                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    API Gateway (Next.js)
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Auth APIs   │   │  AI Services │   │ Team & Data  │
│              │   │   (Groq)     │   │   Storage    │
│ • Login      │   │              │   │              │
│ • Signup     │   │ • Plan       │   │ • Projects   │
│ • Session    │   │ • Features   │   │ • Features   │
│ • OAuth      │   │ • Fix        │   │ • Phases     │
│ • Callback   │   │ • Recommend  │   │ • Prompts    │
└──────────────┘   │              │   └──────────────┘
                   │ • Propose    │
                   │ • Validate   │
                   └──────────────┘
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Supabase     │   │ Groq LLM     │   │ SearXNG      │
│ (Database)   │   │ (Primary AI) │   │ (Web Search) │
│              │   │              │   │              │
│ • PostgreSQL │   │ Llama 3.3 70B│   │ Metasearch   │
│ • Auth       │   │              │   │ 5 parallel   │
│ • Real-time  │   └──────────────┘   │ searches     │
└──────────────┘          ▲             └──────────────┘
                          │                    ▲
                   ┌──────┴──────┐             │
                   │             │             │
                   ▼             ▼             ▼
            ┌────────────┐  ┌──────────┐  ┌─────────┐
            │ Gemini     │  │ Fallback │  │ Docker  │
            │ (Fallback) │  │ Search   │  │         │
            └────────────┘  └──────────┘  └─────────┘
```

### Data Flow Architecture

```
1. PROJECT CREATION FLOW
   User Input → Validate → Store Project → Initialize Planning

2. TECH STACK RECOMMENDATION FLOW
   Project Description
        ↓
   [5 Parallel SearXNG Searches]
   - Frontend frameworks
   - Backend technologies
   - Databases
   - Authentication
   - AI/ML services
        ↓
   [Groq LLM Processing]
   - Analyze results
   - Evaluate trade-offs
   - Select optimal stack
        ↓
   Generate & Store Tech Stack → Display to User

3. ARCHITECTURE GENERATION FLOW
   Tech Stack + Features
        ↓
   [Groq LLM]
   - Generate components
   - Define relationships
   - Create data models
        ↓
   Build Visual Architecture → Store Diagrams

4. PHASE PLANNING FLOW
   Features + Architecture
        ↓
   [Groq LLM]
   - Create 7-phase breakdown
   - Define deliverables
   - Estimate timelines
        ↓
   Generate Phases → Store in DB

5. PROMPT GENERATION FLOW
   For Each Phase:
   - Project context
   - Phase requirements
   - Tech stack
        ↓
   [Groq LLM]
   - Generate detailed prompts
   - Include code examples
   - Format for IDE tools
        ↓
   Display Prompt → User copies to IDE
```

### Component Architecture

```
APP LAYER
├── Authentication Routes
│   ├── /login
│   ├── /signup
│   └── /api/auth/callback
│
├── Protected Routes (Requires Auth)
│   ├── Dashboard
│   │   └── Project Overview
│   │       ├── Recent Projects
│   │       ├── Statistics
│   │       └── Quick Actions
│   │
│   ├── Planner (Multi-step Wizard)
│   │   ├── Step 1: Idea Input
│   │   ├── Step 2: Features
│   │   ├── Step 3: Architecture
│   │   ├── Step 4: Prompts
│   │   ├── Step 5: Blueprint
│   │   └── Step 6: Deploy
│   │
│   ├── Tools Hub
│   │   └── 18+ Development Tools
│   │
│   ├── Error Fix Assistant
│   │   └── Error Analysis & Solutions
│   │
│   ├── Team Workspace
│   │   ├── Team Members
│   │   ├── Workflows
│   │   ├── Prompts
│   │   └── Tools
│   │
│   ├── Badges & Achievements
│   │
│   └── Settings
│       ├── Profile
│       ├── Preferences
│       └── API Keys
│
└── API Routes
    ├── /api/ai/plan
    ├── /api/ai/features
    ├── /api/ai/prompt
    ├── /api/ai/fix
    ├── /api/ai/propose
    ├── /api/ai/all-tools
    ├── /api/ai/validate-feature
    ├── /api/team/analyze
    ├── /api/team/generate-node
    ├── /api/team/prompt
    └── /api/team/role-guide
```

### Database Schema (Key Tables)

```sql
users
├── id (PK)
├── email
├── name
├── profile
├── created_at

projects
├── id (PK)
├── user_id (FK)
├── title
├── description
├── tech_stack (JSON)
├── status
├── created_at

features
├── id (PK)
├── project_id (FK)
├── name
├── description
├── category
├── priority
├── dependencies (JSON)

phases
├── id (PK)
├── project_id (FK)
├── phase_number
├── title
├── description
├── deliverables (JSON)
├── duration
├── status

prompts
├── id (PK)
├── phase_id (FK)
├── tool (Cursor/Windsurf/Bolt.new)
├── content
├── created_at

architecture_nodes
├── id (PK)
├── project_id (FK)
├── node_type
├── label
├── position (JSON)
├── connections (JSON)

teams
├── id (PK)
├── name
├── owner_id (FK)
├── created_at

team_members
├── id (PK)
├── team_id (FK)
├── user_id (FK)
├── role
```

---

## 7. In Scope

### Features Included in MVP

1. **User Management**
   - ✅ Email/password registration
   - ✅ OAuth integration (Google, GitHub)
   - ✅ Session management
   - ✅ User profiles

2. **Project Creation & Management**
   - ✅ Create new projects
   - ✅ Edit project details
   - ✅ View project history
   - ✅ Delete projects

3. **AI-Powered Tech Stack Recommendation**
   - ✅ Live web search integration (SearXNG)
   - ✅ LLM-based analysis (Groq)
   - ✅ Tech stack recommendations with reasoning
   - ✅ Fallback AI models

4. **Intelligent Feature Generation**
   - ✅ Auto-generate features from project description
   - ✅ Manual feature addition/editing
   - ✅ Feature categorization and prioritization
   - ✅ Dependency tracking

5. **Architecture Visualization**
   - ✅ Interactive system diagrams (ReactFlow)
   - ✅ Component node creation
   - ✅ Connection mapping
   - ✅ Export to image/PDF

6. **Phase-Based Planning**
   - ✅ 7-phase implementation roadmap
   - ✅ Milestone and deliverable definition
   - ✅ Phase duration estimation
   - ✅ Progress tracking

7. **LLM-Ready Prompt Generation**
   - ✅ Context-aware prompt creation
   - ✅ Tool-specific formatting (Cursor, Windsurf, Bolt.new)
   - ✅ Code examples and patterns
   - ✅ Copy-to-clipboard functionality

8. **Error Fixing Assistant**
   - ✅ Error message analysis
   - ✅ Solution generation
   - ✅ Resource recommendations

9. **Tool Hub**
   - ✅ 18+ development tools collection
   - ✅ Quick access from dashboard
   - ✅ Tool recommendations

10. **Dashboard & Analytics**
    - ✅ Project overview
    - ✅ Recent activity tracking
    - ✅ Project statistics
    - ✅ Achievement badges

11. **Data Persistence**
    - ✅ Project storage in Supabase
    - ✅ All artifacts saved
    - ✅ Version history
    - ✅ Export functionality

12. **Responsive UI**
    - ✅ Desktop support (primary)
    - ✅ Mobile-friendly design
    - ✅ Tablet optimization
    - ✅ Dark/Light mode support

---

## 8. Out of Scope

### Features Explicitly Excluded from MVP

1. **Advanced Team Collaboration** (Phase 2)
   - ❌ Real-time collaborative editing
   - ❌ Team permissions and roles
   - ❌ Workflow assignments
   - ❌ Comment threads and discussions
   - ❌ Notification system

2. **Advanced Analytics** (Phase 3)
   - ❌ Project success metrics
   - ❌ Team productivity analytics
   - ❌ ROI calculations
   - ❌ Custom reporting

3. **Code Generation** (Phase 3)
   - ❌ Direct code generation
   - ❌ Boilerplate scaffolding
   - ❌ Component library generation
   - ❌ Database migration scripts

4. **Advanced Customization** (Phase 2)
   - ❌ Custom AI models
   - ❌ Fine-tuned recommendations
   - ❌ Custom workflows
   - ❌ Plugin/extension system

5. **Marketplace & Monetization** (Future)
   - ❌ Template marketplace
   - ❌ Premium plans/subscription
   - ❌ Paid add-ons
   - ❌ Affiliate program

6. **Advanced Security** (Phase 2)
   - ❌ SSO/SAML integration
   - ❌ Advanced MFA options
   - ❌ Audit logging
   - ❌ Data encryption key management

7. **Mobile Apps** (Future)
   - ❌ Native iOS app
   - ❌ Native Android app
   - ❌ Offline capabilities
   - ❌ Push notifications

8. **Integration Marketplace** (Future)
   - ❌ Jira integration
   - ❌ GitHub integration
   - ❌ Slack integration
   - ❌ Calendar integration

9. **Multi-Language & Localization** (Future)
   - ❌ i18n support
   - ❌ Localized UI
   - ❌ Language-specific prompts

10. **API/Webhooks** (Phase 3)
    - ❌ REST API for external integrations
    - ❌ Webhook support
    - ❌ GraphQL API
    - ❌ SDK libraries

---

## 9. Future Enhancements

### Phase 2: Team Collaboration & Enterprise
1. **Team Management**
   - Multi-user projects with role-based access
   - Invite team members with permissions
   - Audit logs for compliance

2. **Collaborative Features**
   - Real-time collaborative editing
   - Comments and annotations on architectures
   - Activity streams and notifications
   - Merge conflicts for parallel work

3. **Advanced Integrations**
   - Jira/Azure DevOps integration
   - GitHub integration for deployment
   - Slack notifications
   - Calendar integration

4. **Enterprise Security**
   - SSO (SAML 2.0)
   - Advanced MFA options
   - IP whitelisting
   - Data residency controls

### Phase 3: Code Generation & Intelligence
1. **AI Code Generation**
   - Generate boilerplate code
   - Component library scaffolding
   - Database migration scripts
   - Deployment configuration

2. **Advanced Analysis**
   - Code quality analysis
   - Performance predictions
   - Security vulnerability assessment
   - Architecture optimization recommendations

3. **Extended Tool Hub**
   - 50+ specialized tools
   - Custom tool creation
   - Tool marketplace
   - Open-source contributions

4. **Learning Platform**
   - Tutorials for each tech stack
   - Best practices library
   - Case studies
   - Video walkthroughs

### Phase 4: Marketplace & Monetization
1. **Template Marketplace**
   - Community-contributed templates
   - Premium templates
   - Fork and customize templates
   - Ratings and reviews

2. **Premium Plans**
   - Pro: $19/month (advanced analytics, priority support)
   - Enterprise: Custom (team management, SSO, SLA)
   - Team: $49/month (5 team members, shared projects)

3. **API & Extensibility**
   - REST/GraphQL API
   - Webhook system
   - Python/Node.js SDKs
   - Plugin marketplace

### Phase 5: Intelligence & Optimization
1. **Predictive Analytics**
   - Project success prediction
   - Timeline estimates based on team metrics
   - Risk assessment
   - Resource recommendations

2. **Continuous Optimization**
   - Architecture recommendations as tech evolves
   - Dependency update suggestions
   - Security patch notifications
   - Performance optimization tips

3. **Multi-Model Support**
   - Claude 3 integration
   - GPT-4 fallback
   - Open-source model support
   - Custom model fine-tuning

4. **Mobile Experience**
   - Progressive Web App (PWA)
   - iOS app (React Native)
   - Android app (React Native)
   - Offline capability

---

## 10. Conclusion

### Summary

**Torus AI** solves a critical pain point in software development: the time-consuming and costly process of project planning and architecture design. By combining live web search, cutting-edge LLMs, and an intuitive UI, Torus AI democratizes access to enterprise-grade project planning tools.

### Key Value Propositions

1. **Zero Cost**: Runs entirely on free-tier services
2. **Speed**: Generate complete project plans in minutes, not weeks
3. **Intelligence**: AI-driven recommendations based on current best practices
4. **Actionability**: Phase-by-phase prompts ready for immediate development
5. **Accessibility**: No technical knowledge required to use
6. **Open**: MIT license, self-hostable, community-driven

### Success Metrics

- **User Adoption**: 10,000+ users within 6 months
- **Project Completion**: 80%+ of planned projects shipped
- **User Satisfaction**: 4.5+/5 star rating
- **Community Growth**: 500+ GitHub stars, active contributors
- **Time Savings**: Average 40+ hours saved per project

### Business Model

**Free-to-use open-source platform** with future monetization through:
- Premium features (team collaboration, advanced analytics)
- Marketplace (templates, tools, integrations)
- Enterprise licensing (SLA, support, custom integrations)

### Next Steps

1. **Beta Launch** (Month 1-2): Release MVP to 500 early users
2. **Community Building** (Month 2-4): Gather feedback, grow user base
3. **Phase 2 Development** (Month 3-6): Team collaboration features
4. **Public Launch** (Month 6): Full marketing push, press coverage
5. **Monetization** (Month 9-12): Premium features and marketplace

### Vision

**Torus AI aims to become the go-to platform for intelligent project planning**, enabling millions of developers worldwide to turn ideas into shipped products faster and smarter than ever before.

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-10  
**Status**: Active Development  
**Contact**: support@torusai.dev  
**Repository**: https://github.com/torusai/torus-ai

