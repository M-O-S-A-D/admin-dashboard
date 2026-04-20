'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Save, Eye, EyeOff, Info, Video, Database, HardDrive, Bell } from 'lucide-react';

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1e2530]">
        <div className="text-blue-400">{icon}</div>
        <h2 className="text-white font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[#8892a4] text-sm mb-1.5 font-medium">{label}</label>
      {children}
      {hint && <p className="text-[#4a5568] text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Settings</h1>
          <p className="text-[#8892a4] text-sm">Configure cameras, AWS credentials, and system preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="max-w-2xl">
        {/* AWS Credentials */}
        <Section title="AWS Configuration" icon={<Database size={18} />}>
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
            <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-300 text-xs leading-relaxed">
              Store credentials in <code className="bg-blue-500/20 px-1 rounded">.env.local</code> — never commit them.
              Go to AWS Console → IAM → Users → Security Credentials → Create Access Key.
              Attach policies: <strong>AmazonDynamoDBReadOnlyAccess</strong> + <strong>AmazonS3ReadOnlyAccess</strong>.
            </p>
          </div>

          <Field label="AWS Region" hint="e.g. us-east-1, eu-west-2">
            <input
              type="text"
              placeholder="us-east-1"
              className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </Field>

          <Field label="Access Key ID">
            <input
              type="text"
              placeholder="AKIAIOSFODNN7EXAMPLE"
              className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </Field>

          <Field label="Secret Access Key">
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecret(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5568] hover:text-white transition-colors"
              >
                {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="DynamoDB Table Name" hint="Primary key: eventId (String)">
              <input
                type="text"
                placeholder="mosad-events"
                className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </Field>
            <Field label="S3 Bucket Name" hint="Stores frames/<cameraId>/<eventId>.jpg">
              <input
                type="text"
                placeholder="mosad-frames"
                className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </Field>
          </div>
        </Section>

        {/* Camera configuration */}
        <Section title="RTSP Camera Streams" icon={<Video size={18} />}>
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
            <Info size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-xs leading-relaxed">
              The dashboard and Raspberry Pi must be on the same local network (connected via router).
              Enter the Pi&apos;s local IP address below. Default RTSP port is <strong>554</strong>.
              You can find the Pi&apos;s IP with: <code className="bg-yellow-500/20 px-1 rounded">hostname -I</code>
            </p>
          </div>

          <Field label="Raspberry Pi Host / IP" hint="e.g. 192.168.1.101 — both devices must be on the same router">
            <input
              type="text"
              placeholder="192.168.1.101"
              className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </Field>

          <Field label="RTSP Stream Path" hint="The path configured in your streaming software (e.g. mediamtx, FFmpeg, or libcamera)">
            <input
              type="text"
              placeholder="/stream"
              defaultValue="/stream"
              className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </Field>

          <Field label="RTSP Port">
            <input
              type="number"
              placeholder="554"
              defaultValue={554}
              className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </Field>
        </Section>

        {/* Storage */}
        <Section title="Storage & Retention" icon={<HardDrive size={18} />}>
          <Field label="Auto-archive after (days)" hint="Clips older than this threshold are moved to cold S3 storage">
            <input
              type="number"
              defaultValue={30}
              className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </Field>
          <Field label="Pre-signed URL expiry (seconds)" hint="How long generated S3 image URLs remain valid">
            <input
              type="number"
              defaultValue={900}
              className="w-full bg-[#111827] border border-[#1e2530] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </Field>
        </Section>

        {/* Notifications */}
        <Section title="Alert Notifications" icon={<Bell size={18} />}>
          <div className="space-y-3">
            {['Critical intrusion events', 'Unidentified personnel', 'Unattended packages > 5 mins', 'Camera offline', 'Storage > 90%'].map(label => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                <span className="text-[#c9d1d9] text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Section>
      </div>
    </AppLayout>
  );
}
