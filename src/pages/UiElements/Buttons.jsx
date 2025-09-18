import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Box } from "lucide-react"; // example icon, replace with your own

export default function Buttons() {
  return (
    <div>
      <PageMeta
        title="React.js Buttons Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Buttons Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Buttons" />
      <div className="space-y-5 sm:space-y-6">
        {/* Primary Button */}
        <ComponentCard title="Primary Button">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary">
              Button Text
            </Button>
            <Button size="md" variant="primary">
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* Primary Button with Left Icon */}
        <ComponentCard title="Primary Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" startIcon={<Box className="size-5" />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" startIcon={<Box className="size-5" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* Primary Button with Right Icon */}
        <ComponentCard title="Primary Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" endIcon={<Box className="size-5" />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" endIcon={<Box className="size-5" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* Outline Button */}
        <ComponentCard title="Secondary Button">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline">
              Button Text
            </Button>
            <Button size="md" variant="outline">
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* Outline Button with Left Icon */}
        <ComponentCard title="Outline Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline" startIcon={<Box className="size-5" />}>
              Button Text
            </Button>
            <Button size="md" variant="outline" startIcon={<Box className="size-5" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* Outline Button with Right Icon */}
        <ComponentCard title="Outline Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline" endIcon={<Box className="size-5" />}>
              Button Text
            </Button>
            <Button size="md" variant="outline" endIcon={<Box className="size-5" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
