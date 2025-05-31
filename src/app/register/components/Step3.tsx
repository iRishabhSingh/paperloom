"use client";

import { FaUser, FaEnvelope, FaGlobe } from "react-icons/fa";

interface Step3Props {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    region: string;
  };
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Step3({ formData, onChange }: Readonly<Step3Props>) {
  const regions = [
    { code: "US", name: "United States" },
    { code: "IN", name: "India" },
    { code: "EU", name: "European Union" },
    { code: "UK", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-box bg-base-200 p-4">
        <h3 className="mb-4 text-lg font-semibold">Review Your Information</h3>

        <div className="space-y-3">
          <div className="flex items-center">
            <FaUser className="mr-3 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>
                {formData.firstName} {formData.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <FaEnvelope className="mr-3 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{formData.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <FaUser className="mr-3 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p>@{formData.username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="region-select">
          <span className="label-text">Region*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaGlobe className="text-gray-400" />
          </div>
          <select
            id="region-select"
            title="Region"
            name="region"
            value={formData.region}
            onChange={onChange}
            className="select select-bordered w-full pl-10"
            required
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-control mt-6">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox-primary checkbox"
            required
          />
          <span className="label-text">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>
      </div>
    </div>
  );
}
