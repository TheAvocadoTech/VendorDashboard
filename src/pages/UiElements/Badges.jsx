import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";

export default function Badges() {
  return (
    <div>
      <PageMeta
        title="React.js Badges Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Badges Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Badges" />
      <div className="space-y-5 sm:space-y-6">
        {/* Light Background */}
        <ComponentCard title="With Light Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary">Primary</Badge>
            <Badge variant="light" color="success">Success</Badge>
            <Badge variant="light" color="error">Error</Badge>
            <Badge variant="light" color="warning">Warning</Badge>
            <Badge variant="light" color="info">Info</Badge>
            <Badge variant="light" color="light">Light</Badge>
            <Badge variant="light" color="dark">Dark</Badge>
          </div>
        </ComponentCard>

        {/* Solid Background */}
        <ComponentCard title="With Solid Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary">Primary</Badge>
            <Badge variant="solid" color="success">Success</Badge>
            <Badge variant="solid" color="error">Error</Badge>
            <Badge variant="solid" color="warning">Warning</Badge>
            <Badge variant="solid" color="info">Info</Badge>
            <Badge variant="solid" color="light">Light</Badge>
            <Badge variant="solid" color="dark">Dark</Badge>
          </div>
        </ComponentCard>

        {/* Light Background - No icons */}
        <ComponentCard title="Light Background (No Icons)">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary">Primary</Badge>
            <Badge variant="light" color="success">Success</Badge>
            <Badge variant="light" color="error">Error</Badge>
            <Badge variant="light" color="warning">Warning</Badge>
            <Badge variant="light" color="info">Info</Badge>
            <Badge variant="light" color="light">Light</Badge>
            <Badge variant="light" color="dark">Dark</Badge>
          </div>
        </ComponentCard>

        {/* Solid Background - No icons */}
        <ComponentCard title="Solid Background (No Icons)">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary">Primary</Badge>
            <Badge variant="solid" color="success">Success</Badge>
            <Badge variant="solid" color="error">Error</Badge>
            <Badge variant="solid" color="warning">Warning</Badge>
            <Badge variant="solid" color="info">Info</Badge>
            <Badge variant="solid" color="light">Light</Badge>
            <Badge variant="solid" color="dark">Dark</Badge>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
