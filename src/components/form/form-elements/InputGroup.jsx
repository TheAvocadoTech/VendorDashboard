import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import PhoneInput from "../group-input/PhoneInput";

export default function InputGroup() {
  const countries = [
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
  ];

  const handlePhoneNumberChange = (phoneNumber) => {
    console.log("Updated phone number:", phoneNumber);
  };

  return (
    <ComponentCard title="Input Group">
      <div className="space-y-6">
        {/* Email Input */}
        <div>
          <Label>Email</Label>
          <div>
            <Input
              placeholder="info@gmail.com"
              type="text"
            />
          </div>
        </div>

        {/* Phone Input (Select at Start) */}
        <div>
          <Label>Phone</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>

        {/* Phone Input (Select at End) */}
        <div>
          <Label>Phone</Label>
          <PhoneInput
            selectPosition="end"
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
