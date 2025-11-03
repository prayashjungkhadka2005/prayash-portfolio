# 🚀 Quick Guide: Adding New Features

## ⚡ 3-Step Process

### Step 1: Create Feature Directory
```bash
mkdir -p src/features/your-feature-name/{components,hooks,utils,types,styles}
```

### Step 2: Build Your Feature
```typescript
// src/features/your-feature-name/components/YourComponent.tsx
"use client";

import { useState } from "react";
import { YourType } from "../types";

export default function YourComponent() {
  const [state, setState] = useState<YourType>({});
  
  return (
    <div className="p-6 bg-white dark:bg-warm-dark">
      {/* Your UI */}
    </div>
  );
}
```

### Step 3: Create Route
```typescript
// src/app/your-feature/page.tsx
import YourComponent from "@/features/your-feature-name/components/YourComponent";

export default function Page() {
  return <YourComponent />;
}
```

**That's it! No configuration needed!** ✅

---

## 📂 Feature Template

Copy this structure for every new feature:

```
src/features/your-feature/
├── components/
│   ├── MainComponent.tsx       # Primary component
│   ├── SubComponent.tsx        # Supporting components
│   └── ui/                     # Feature-specific UI
│       └── CustomButton.tsx
├── hooks/
│   └── useYourHook.ts         # Custom hooks
├── utils/
│   ├── helpers.ts             # Business logic
│   └── validators.ts          # Validation functions
├── types/
│   └── index.ts               # TypeScript types
└── styles/
    └── your-feature.css       # Feature CSS (optional)
```

---

## 🎯 Real Examples

### Example 1: Regex Tester
```
src/features/regex-tester/
├── components/
│   ├── RegexInput.tsx
│   ├── TestStringInput.tsx
│   └── MatchResults.tsx
├── utils/
│   └── regex-validator.ts
└── types/
    └── index.ts
```

### Example 2: MongoDB Query Builder
```
src/features/mongodb-builder/
├── components/
│   ├── CollectionSelector.tsx
│   ├── QueryBuilder.tsx
│   └── ResultViewer.tsx
├── hooks/
│   └── useMongoQuery.ts
├── utils/
│   ├── query-generator.ts
│   └── mock-data.ts
└── types/
    └── index.ts
```

---

## ✅ Checklist When Adding Features

- [ ] Created feature directory in `src/features/`
- [ ] All components use TypeScript
- [ ] Types defined in `types/index.ts`
- [ ] Business logic in `utils/`
- [ ] Created route in `src/app/`
- [ ] Tested in development
- [ ] No import errors
- [ ] Styles working (Tailwind auto-scans `src/features/**`)

---

## 🔗 Import Paths

Always use absolute imports:

```typescript
// ✅ GOOD
import Component from "@/features/my-feature/components/Component";
import { MyType } from "@/features/my-feature/types";
import { helper } from "@/features/my-feature/utils/helpers";

// ❌ BAD
import Component from "../../features/my-feature/components/Component";
```

---

## 🎨 Using Shared Components

```typescript
// Import from shared
import ThemeToggle from "@/shared/components/ThemeToggle";

// Or create new shared components
// src/shared/components/Button.tsx
export default function Button({ children, ...props }) {
  return (
    <button className="px-4 py-2 bg-primary text-white rounded" {...props}>
      {children}
    </button>
  );
}
```

---

## 📝 Next.js Route Examples

### Simple Page
```typescript
// src/app/my-tool/page.tsx
import Tool from "@/features/my-tool/components/Tool";

export default function Page() {
  return <Tool />;
}
```

### Page with Metadata
```typescript
// src/app/my-tool/page.tsx
import { Metadata } from "next";
import Tool from "@/features/my-tool/components/Tool";

export const metadata: Metadata = {
  title: "My Tool - Prayash Portfolio",
  description: "Description of my tool",
};

export default function Page() {
  return <Tool />;
}
```

### API Route
```typescript
// src/app/api/my-feature/route.ts
export async function GET(request: Request) {
  const data = await fetchData();
  return Response.json(data);
}
```

---

## 🚨 Common Mistakes to Avoid

1. **Circular Dependencies**
   ```typescript
   // ❌ DON'T
   // Feature A imports from Feature B
   // Feature B imports from Feature A
   
   // ✅ DO
   // Both import from shared/
   ```

2. **Business Logic in Components**
   ```typescript
   // ❌ DON'T
   function Component() {
     const result = /* complex calculation */;
   }
   
   // ✅ DO
   function Component() {
     const result = useCalculation(); // hook
     // or
     const result = calculate(); // util function
   }
   ```

3. **Forgetting "use client"**
   ```typescript
   // ❌ Server component using hooks
   export default function Component() {
     const [state, setState] = useState(); // Error!
   }
   
   // ✅ Client component
   "use client";
   export default function Component() {
     const [state, setState] = useState(); // Works!
   }
   ```

---

**Happy Coding! 🚀**

Last Updated: November 3, 2025
