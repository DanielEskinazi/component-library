# COMPONENT LIBRARY INFINITE ITERATION PROMPT

TASK: Generate component iteration [NUMBER] for [DOMAIN] domain in [COMPONENT_NAME] with focus on [INNOVATION_DIMENSION]

You are Sub Agent [X] generating component iteration [NUMBER] for a domain-based component library monorepo.

## CONTEXT

- **Target Domain**: [One of: Audio, Video, Data, Forms, Navigation, Layout, Media, Communication, Commerce, Social, Maps, Calendar, File, Search, Authentication, Monitoring, Gaming, Educational, Productivity, AI/ML, IoT, Blockchain, AR/VR]
- **Component Specification**: [Full component requirements and behavior specification]
- **Existing Iterations**: [Summary of current components in domain]
- **Your Iteration Number**: [NUMBER]
- **Assigned Innovation Dimension**: [Specific innovation focus - see dimensions below]
- **Repository Architecture**: Domain-based monorepo with pnpm workspaces, Turborepo, TypeScript, Storybook

## COMPLETE ITERATION REQUIREMENTS

### 1. CORE PACKAGE IMPLEMENTATION

**Location**: `packages/core/[domain]/src/[component-name]/`

**Must Include**:

- Main hook/logic implementation with TypeScript interfaces
- Provider pattern for platform abstraction (Web/Native/Mock providers)
- Utility functions, helpers, and error handling
- Edge case management and graceful degradation
- Platform-agnostic business logic
- Proper exports in `index.ts` with domain grouping

### 2. PLATFORM COMPONENT IMPLEMENTATION

**Location**: `packages/web/react/tailwind/src/[domain]/[ComponentName].tsx`

**Must Include**:

- **Base Component**: Full implementation using core package logic
- **Natural Variations**:
  - Sizes: `sm`, `md`, `lg`, `xl` with responsive behavior
  - States: `loading`, `error`, `success`, `disabled`, `pending`
  - Behaviors: `controlled`, `uncontrolled`, `async`, `realtime`
- **Styling Options**:
  - Color schemes: `primary`, `secondary`, `accent`, `neutral`, `success`, `warning`, `error`
  - Themes: `light`, `dark`, `system`, `high-contrast`
  - Layouts: `horizontal`, `vertical`, `grid`, `inline`, `floating`
  - Animations: `fade`, `slide`, `scale`, `bounce`, `pulse` with `motion-reduce` support
- **Accessibility Features**:
  - ARIA attributes, roles, and properties
  - Keyboard navigation support
  - Screen reader compatibility
  - Focus management and visual indicators
- **Responsive Design**: Mobile-first approach with breakpoint considerations
- **Error Boundaries**: Graceful failure handling with user-friendly messages

### 3. COMPREHENSIVE STORYBOOK DOCUMENTATION

**Location**: `documentation/storybook/stories/[ComponentName].stories.tsx`

**Must Include**:

- **Default/Playground Story**: Interactive controls for all props and variations
- **Variation Stories**: Individual stories for each size, state, and styling option
- **Interactive Demos**: Real functionality demonstrations (not mocked)
- **Edge Case Stories**: Loading states, error conditions, empty data scenarios
- **Accessibility Story**: Focus management, keyboard navigation examples
- **MDX Documentation**:
  - Installation instructions with multiple import patterns
  - Complete API reference with TypeScript definitions
  - Usage examples with live code snippets
  - Best practices and common patterns
- **Real Data Integration**: Use actual browser APIs where applicable (not just static examples)

### 4. FULL TESTING SUITE

**Unit Tests** (`packages/core/[domain]/src/[component-name]/__tests__/`):

- Core logic and hook behavior
- Provider pattern implementation
- Utility function coverage
- Error handling scenarios

**Component Tests** (`packages/web/react/tailwind/src/[domain]/__tests__/`):

- Rendering with all prop combinations
- User interaction simulation
- State management validation
- Integration with core package

**Playwright E2E Tests** (`packages/web/react/tailwind/e2e/[component-name].spec.ts`):

- Complex user workflows
- Browser API interactions
- Cross-browser compatibility
- Real-world usage scenarios

**Accessibility Tests**:

- axe-core integration for WCAG compliance
- Keyboard navigation validation
- Screen reader compatibility
- Color contrast verification

**Visual Regression Tests**:

- Screenshot comparisons for all styling variations
- Responsive design validation
- Theme switching behavior

**ALL TESTS MUST PASS** before iteration is considered complete.

### 5. PACKAGE INTEGRATION & QUALITY GATES

**Export Configuration**:

- Update all relevant `index.ts` files with proper exports
- Support multiple import patterns:

  ```typescript
  // Individual imports
  import { ComponentName } from '@mycomponents/react-tailwind';

  // Domain-grouped imports
  import { Domain } from '@mycomponents/react-tailwind';

  // Core functionality only
  import { useComponentName } from '@mycomponents/[domain]-core';
  ```

**Quality Gates - Must Pass**:

- **TypeScript Compilation**: `pnpm run type-check` (strict mode)
- **ESLint Validation**: `pnpm run lint` (shared configuration compliance)
- **Prettier Formatting**: `pnpm run format` (consistent code style)
- **All Test Suites**: Unit, component, e2e, accessibility, visual regression
- **Storybook Build**: `pnpm run storybook` builds without errors
- **Package Builds**: `pnpm run build` succeeds across all affected packages
- **Import Pattern Validation**: All import styles work correctly

**Workspace Dependencies**:

- Use `workspace:*` protocol for internal dependencies
- Proper peer dependency configuration
- Compatible version ranges

## INNOVATION DIMENSIONS

Choose ONE primary dimension per iteration:

### Technical Innovation

- **Performance**: Virtualization, lazy loading, memoization, caching strategies
- **Accessibility**: Advanced WCAG features, assistive technology integration
- **Responsiveness**: Container queries, fluid typography, adaptive layouts
- **Animation**: Complex micro-interactions, physics-based animations, gesture support

### Interaction Innovation

- **Gestures**: Touch, drag, swipe, pinch, multi-touch support
- **Voice**: Speech recognition, voice commands, audio feedback
- **AI Integration**: Smart suggestions, predictive behavior, adaptive interfaces
- **Real-time**: Live collaboration, synchronized states, conflict resolution

### API Integration Innovation

- **Browser APIs**: Web APIs (Camera, Geolocation, Payments, File System)
- **Third-party Services**: OAuth providers, payment processors, analytics
- **Performance APIs**: Intersection Observer, Resize Observer, Performance Observer
- **Experimental APIs**: Web Bluetooth, WebXR, Web Share, Background Sync

### Customization Innovation

- **Theming**: Advanced theme systems, CSS custom properties, design tokens
- **Configuration**: Plugin architecture, extensible behavior, custom renderers
- **Styling**: CSS-in-JS innovations, atomic CSS, style variants
- **Composition**: Compound components, render props, polymorphic components

## EXECUTION REQUIREMENTS

### Quality & Uniqueness

- Each iteration must be genuinely unique and valuable
- Build upon existing components while introducing novel elements
- Maintain consistency with monorepo architecture and patterns
- Ensure production-ready quality with comprehensive error handling

### Repository Compliance

- Follow domain-based package organization
- Implement provider pattern for platform abstraction
- Use shared configurations (tsup, TypeScript, ESLint, Prettier)
- Maintain workspace dependency patterns
- Support all import/export patterns

### Documentation Standards

- Interactive Storybook stories with real functionality
- Complete TypeScript API documentation
- Installation and usage examples for all supported platforms
- Accessibility guidelines and best practices
- Performance considerations and optimization tips

### Testing Excellence

- Comprehensive test coverage across all testing levels
- Real browser API testing using Playwright MCP
- Accessibility compliance validation
- Visual regression protection
- Cross-platform compatibility verification

## DELIVERABLE CHECKLIST

Before marking iteration complete, verify:

- [ ] Core package implementation with provider pattern
- [ ] Platform component with all required variations and styling options
- [ ] Complete Storybook documentation with interactive examples
- [ ] Full testing suite with 100% pass rate
- [ ] All quality gates passed (TypeScript, ESLint, Prettier, builds)
- [ ] Package integration working (exports, imports, dependencies)
- [ ] Innovation dimension clearly demonstrated and documented
- [ ] Accessibility features implemented and tested
- [ ] Browser API integration (where applicable) functional
- [ ] Error handling and edge cases covered
- [ ] Performance optimizations applied
- [ ] Documentation complete with usage examples

## PARALLEL EXECUTION MANAGEMENT

### Wave-Based Generation

When orchestrating multiple agents:

1. **Wave Planning**: Determine wave size (3-5 agents) based on context capacity
2. **Domain Distribution**: Assign different domains/innovation dimensions to avoid overlap
3. **Dependency Management**: Ensure no package conflicts during parallel development
4. **Progress Monitoring**: Track completion status and quality gate passage
5. **Integration Validation**: Verify all components work together in final build

### Context Optimization

- Each wave uses fresh agent instances to avoid context accumulation
- Progressive summarization of completed iterations
- Strategic pruning of less essential details in later waves
- Graceful conclusion when approaching context limits

### Failure Handling

- Reassign iteration numbers for failed agents
- Validate no duplicate component names across parallel streams
- Ensure coherent progression despite parallel execution
- Maintain specification compliance across all outputs

DELIVERABLE: Complete, production-ready component iteration following all requirements above.
