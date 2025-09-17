import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import DatePicker from "../date-picker"; // JS version

export default function DefaultInputs() {
  const [showPassword, setShowPassword] = useState(false);

  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const handleSelectChange = (value) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        {/* Normal Input */}
        <div>
          <Label htmlFor="input">Input</Label>
          <Input type="text" id="input" />
        </div>

        {/* Input with Placeholder */}
        <div>
          <Label htmlFor="inputTwo">Input with Placeholder</Label>
          <Input type="text" id="inputTwo" placeholder="info@gmail.com" />
        </div>

        {/* Select Input */}
        <div>
          <Label>Select Input</Label>
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>

        {/* Password Input */}
        <div>
          <Label>Password Input</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Date Picker */}
        <div>
          <DatePicker
            id="date-picker"
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              console.log({ dates, currentDateString });
            }}
          />
        </div>

        {/* Time Picker */}
        <div>
          <Label htmlFor="tm">Time Picker Input</Label>
          <Input
            type="time"
            id="tm"
            name="tm"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>

        {/* Payment Input */}
        <div>
          <Label htmlFor="payment">Input with Payment</Label>
          <Input
            type="text"
            placeholder="Card number"
            className="pl-[62px]"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
