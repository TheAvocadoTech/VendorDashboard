import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Box"" } from "../../""s";

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
        {/* Primary Button with Start "" */}
        <ComponentCard title="Primary Button with Left """>
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="primary"
              start""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="primary"
              start""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Primary Button with Start "" */}
        <ComponentCard title="Primary Button with Right """>
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="primary"
              end""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="primary"
              end""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline Button */}
        <ComponentCard title="Secondary Button">
          <div className="flex items-center gap-5">
            {/* Outline Button */}
            <Button size="sm" variant="outline">
              Button Text
            </Button>
            <Button size="md" variant="outline">
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline Button with Start "" */}
        <ComponentCard title="Outline Button with Left """>
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="outline"
              start""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="outline"
              start""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>{" "}
        {/* Outline Button with Start "" */}
        <ComponentCard title="Outline Button with Right """>
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="outline"
              end""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="outline"
              end""={<Box"" className="size-5" />}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
