import React, { useState, PropsWithChildren } from "react";

// ==========================================
// 1. BASIC PROPS TYPING - Foundation
// ==========================================

interface BasicButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

function BasicButton({
  label,
  onClick,
  variant = "primary",
  disabled = false,
}: BasicButtonProps) {
  const baseStyle = "px-4 py-2 rounded font-semibold transition-colors";
  const variantStyle =
    variant === "primary"
      ? "bg-blue-500 hover:bg-blue-600 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
}

const BasicPropsDemo = () => {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Basic Props Typing</h3>
      <p className="text-sm mb-3">
        Props defined with interface - type-safe and autocomplete-enabled
      </p>
      <div className="flex gap-2 mb-2">
        <BasicButton
          label="Primary"
          onClick={() => setClicks((c) => c + 1)}
          variant="primary"
        />
        <BasicButton
          label="Secondary"
          onClick={() => setClicks((c) => c + 1)}
          variant="secondary"
        />
        <BasicButton
          label="Disabled"
          onClick={() => setClicks((c) => c + 1)}
          disabled
        />
      </div>
      <p className="text-sm font-semibold">Clicks: {clicks}</p>
      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`interface BasicButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 2. REACT.FC vs PLAIN FUNCTION
// ==========================================

// ❌ Using React.FC (not recommended)
interface ReactFCCardProps {
  title: string;
}

const ReactFCCard: React.FC<ReactFCCardProps> = ({ title, children }) => {
  return (
    <div className="border p-3 rounded bg-white">
      <h4 className="font-semibold mb-1">{title}</h4>
      <div>{children}</div>
    </div>
  );
};

// ✅ Plain function (recommended)
interface PlainCardProps {
  title: string;
  children: React.ReactNode;
}

function PlainCard({ title, children }: PlainCardProps) {
  return (
    <div className="border p-3 rounded bg-white">
      <h4 className="font-semibold mb-1">{title}</h4>
      <div>{children}</div>
    </div>
  );
}

const FCvsPlainDemo = () => {
  return (
    <div className="p-4 border rounded mb-4 bg-red-50">
      <h3 className="font-bold text-lg mb-2">2. React.FC vs Plain Function</h3>
      <p className="text-sm mb-3">
        ❌ React.FC includes children implicitly (problematic)
        <br />✅ Plain function - explicit children prop (recommended)
      </p>
      <div className="grid grid-cols-2 gap-2">
        <ReactFCCard title="React.FC Card">
          Children implicit in type
        </ReactFCCard>
        <PlainCard title="Plain Card">Children explicit in props</PlainCard>
      </div>
      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`// ✅ RECOMMENDED
interface Props {
  title: string;
  children: React.ReactNode; // Explicit
}
function Card({ title, children }: Props)`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 3. CHILDREN PROP PATTERNS
// ==========================================

// Pattern 1: PropsWithChildren utility
interface ContainerProps {
  bgColor: string;
}

function Container({ bgColor, children }: PropsWithChildren<ContainerProps>) {
  return <div className={`p-3 rounded ${bgColor}`}>{children}</div>;
}

// Pattern 2: Explicit React.ReactNode
interface BoxProps {
  title: string;
  children: React.ReactNode;
}

function Box({ title, children }: BoxProps) {
  return (
    <div className="border-2 border-dashed border-gray-400 p-2 rounded">
      <div className="font-bold text-xs mb-1">{title}</div>
      {children}
    </div>
  );
}

// Pattern 3: Render prop
interface RenderPropProps {
  items: string[];
  renderItem: (item: string, index: number) => React.ReactNode;
}

function RenderPropList({ items, renderItem }: RenderPropProps) {
  return (
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

const ChildrenPatternsDemo = () => {
  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">3. Children Prop Patterns</h3>

      <div className="space-y-2 mb-3">
        <Container bgColor="bg-yellow-100">
          <span className="text-sm">PropsWithChildren utility</span>
        </Container>

        <Box title="React.ReactNode">
          <span className="text-sm">Accepts any renderable content</span>
        </Box>

        <Box title="Render Prop Pattern">
          <RenderPropList
            items={["Apple", "Banana", "Orange"]}
            renderItem={(item, i) => (
              <span className="text-sm">
                {i + 1}. {item}
              </span>
            )}
          />
        </Box>
      </div>

      <div className="p-2 bg-white rounded text-xs font-mono">
        <pre>{`// PropsWithChildren<T> adds children automatically
function Container({ children }: PropsWithChildren<Props>)

// Render prop for custom rendering logic
renderItem: (item: T) => React.ReactNode`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 4. CALLBACK PROPS TYPING
// ==========================================

interface CallbackFormProps {
  onSubmit: (data: { name: string; email: string }) => void;
  onChange: (field: string, value: string) => void;
  onValidate: (value: string) => boolean;
  onCancel?: () => void; // Optional callback
}

function CallbackForm({
  onSubmit,
  onChange,
  onValidate,
  onCancel,
}: CallbackFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (onValidate(email)) {
      onSubmit({ name, email });
    }
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onChange("name", e.target.value);
        }}
        className="border px-2 py-1 rounded w-full text-sm"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          onChange("email", e.target.value);
        }}
        className="border px-2 py-1 rounded w-full text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Submit
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

const CallbackPropsDemo = () => {
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">4. Callback Props Typing</h3>
      <p className="text-sm mb-3">
        Type-safe callbacks with parameters and return values
      </p>

      <CallbackForm
        onSubmit={(data) => setLog([...log, `✅ Submitted: ${data.name}`])}
        onChange={(field, value) =>
          setLog([...log, `📝 Changed ${field}: ${value}`])
        }
        onValidate={(email) => {
          const valid = email.includes("@");
          if (!valid) setLog([...log, "❌ Invalid email"]);
          return valid;
        }}
        onCancel={() => setLog([...log, "🚫 Cancelled"])}
      />

      <div className="mt-3 bg-white p-2 rounded max-h-32 overflow-y-auto">
        <p className="font-semibold text-xs mb-1">Event Log:</p>
        {log.slice(-5).map((entry, i) => (
          <p key={i} className="text-xs font-mono">
            {entry}
          </p>
        ))}
      </div>

      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`interface Props {
  onSubmit: (data: FormData) => void;
  onChange: (field: string, value: string) => void;
  onValidate: (value: string) => boolean;
  onCancel?: () => void; // Optional
}`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 5. GENERIC COMPONENTS
// ==========================================

interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function GenericList<T>({
  items,
  renderItem,
  keyExtractor,
}: GenericListProps<T>) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={keyExtractor(item)} className="p-2 bg-white rounded border">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

// Generic with constraint
interface GenericTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
  }>;
  onRowClick: (item: T) => void;
}

function GenericTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
}: GenericTableProps<T>) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col) => (
            <th key={String(col.key)} className="border p-1 text-left">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row.id}
            onClick={() => onRowClick(row)}
            className="hover:bg-blue-50 cursor-pointer"
          >
            {columns.map((col) => (
              <td key={String(col.key)} className="border p-1">
                {String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const GenericComponentsDemo = () => {
  const users = [
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "User" },
  ];

  const products = [
    { id: "p1", title: "Laptop", price: 999 },
    { id: "p2", title: "Mouse", price: 29 },
  ];

  const [selected, setSelected] = useState<string>("");

  return (
    <div className="p-4 border rounded bg-orange-50">
      <h3 className="font-bold text-lg mb-2">5. Generic Components</h3>
      <p className="text-sm mb-3">
        Type-safe components that work with any data type
      </p>

      <div className="mb-3">
        <p className="font-semibold text-sm mb-1">Generic List (Users):</p>
        <GenericList
          items={users}
          keyExtractor={(user) => user.id}
          renderItem={(user) => (
            <span className="text-sm">
              {user.name} - {user.role}
            </span>
          )}
        />
      </div>

      <div className="mb-3">
        <p className="font-semibold text-sm mb-1">Generic Table (Products):</p>
        <GenericTable
          data={products}
          columns={[
            { key: "title", label: "Product" },
            { key: "price", label: "Price" },
          ]}
          onRowClick={(product) => setSelected(product.title)}
        />
        {selected && <p className="text-xs mt-1">Selected: {selected}</p>}
      </div>

      <div className="p-2 bg-white rounded text-xs font-mono">
        <pre>{`function List<T>({ items }: { items: T[] }) {
  // T is inferred from usage!
}

// With constraint
function Table<T extends { id: number }>({ data }: Props<T>)`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP
// ==========================================

export default function App() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        TypeScript + React: Component Typing
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Section 5.1 - Interactive Examples
      </p>

      <BasicPropsDemo />
      <FCvsPlainDemo />
      <ChildrenPatternsDemo />
      <CallbackPropsDemo />
      <GenericComponentsDemo />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 Key Takeaways:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Use interface for props, type for unions/intersections</li>
          <li>✅ Prefer plain functions over React.FC</li>
          <li>✅ Use React.ReactNode or PropsWithChildren for children</li>
          <li>✅ Type callbacks with parameter and return types</li>
          <li>✅ Generic components maintain type safety across types</li>
          <li>✅ Optional props with ? and defaults in destructuring</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
        <p className="text-sm font-semibold mb-1">💡 Interview Pro Tip:</p>
        <p className="text-sm">
          Always mention WHY you avoid React.FC: implicit children, generic
          issues, and community consensus. Show you understand the evolution of
          best practices!
        </p>
      </div>
    </div>
  );
}
