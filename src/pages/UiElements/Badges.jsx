import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import { Plus"" } from "../../""s";
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
        <ComponentCard title="With Light Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            {/* Light Variant */}
            <Badge variant="light" color="primary">
              Primary
            </Badge>
            <Badge variant="light" color="success">
              Success
            </Badge>{" "}
            <Badge variant="light" color="error">
              Error
            </Badge>{" "}
            <Badge variant="light" color="warning">
              Warning
            </Badge>{" "}
            <Badge variant="light" color="info">
              Info
            </Badge>
            <Badge variant="light" color="light">
              Light
            </Badge>
            <Badge variant="light" color="dark">
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="With Solid Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            {/* Light Variant */}
            <Badge variant="solid" color="primary">
              Primary
            </Badge>
            <Badge variant="solid" color="success">
              Success
            </Badge>{" "}
            <Badge variant="solid" color="error">
              Error
            </Badge>{" "}
            <Badge variant="solid" color="warning">
              Warning
            </Badge>{" "}
            <Badge variant="solid" color="info">
              Info
            </Badge>
            <Badge variant="solid" color="light">
              Light
            </Badge>
            <Badge variant="solid" color="dark">
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Light Background with Left """>
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary" start""={<Plus"" />}>
              Primary
            </Badge>
            <Badge variant="light" color="success" start""={<Plus"" />}>
              Success
            </Badge>{" "}
            <Badge variant="light" color="error" start""={<Plus"" />}>
              Error
            </Badge>{" "}
            <Badge variant="light" color="warning" start""={<Plus"" />}>
              Warning
            </Badge>{" "}
            <Badge variant="light" color="info" start""={<Plus"" />}>
              Info
            </Badge>
            <Badge variant="light" color="light" start""={<Plus"" />}>
              Light
            </Badge>
            <Badge variant="light" color="dark" start""={<Plus"" />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Solid Background with Left """>
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary" start""={<Plus"" />}>
              Primary
            </Badge>
            <Badge variant="solid" color="success" start""={<Plus"" />}>
              Success
            </Badge>{" "}
            <Badge variant="solid" color="error" start""={<Plus"" />}>
              Error
            </Badge>{" "}
            <Badge variant="solid" color="warning" start""={<Plus"" />}>
              Warning
            </Badge>{" "}
            <Badge variant="solid" color="info" start""={<Plus"" />}>
              Info
            </Badge>
            <Badge variant="solid" color="light" start""={<Plus"" />}>
              Light
            </Badge>
            <Badge variant="solid" color="dark" start""={<Plus"" />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Light Background with Right """>
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary" end""={<Plus"" />}>
              Primary
            </Badge>
            <Badge variant="light" color="success" end""={<Plus"" />}>
              Success
            </Badge>{" "}
            <Badge variant="light" color="error" end""={<Plus"" />}>
              Error
            </Badge>{" "}
            <Badge variant="light" color="warning" end""={<Plus"" />}>
              Warning
            </Badge>{" "}
            <Badge variant="light" color="info" end""={<Plus"" />}>
              Info
            </Badge>
            <Badge variant="light" color="light" end""={<Plus"" />}>
              Light
            </Badge>
            <Badge variant="light" color="dark" end""={<Plus"" />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Solid Background with Right """>
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary" end""={<Plus"" />}>
              Primary
            </Badge>
            <Badge variant="solid" color="success" end""={<Plus"" />}>
              Success
            </Badge>{" "}
            <Badge variant="solid" color="error" end""={<Plus"" />}>
              Error
            </Badge>{" "}
            <Badge variant="solid" color="warning" end""={<Plus"" />}>
              Warning
            </Badge>{" "}
            <Badge variant="solid" color="info" end""={<Plus"" />}>
              Info
            </Badge>
            <Badge variant="solid" color="light" end""={<Plus"" />}>
              Light
            </Badge>
            <Badge variant="solid" color="dark" end""={<Plus"" />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
