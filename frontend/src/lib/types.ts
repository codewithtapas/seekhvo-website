export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  headline: string;
  bio: string;
  avatar_url: string;
  city: string;
  country: string;
  email_verified: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface LessonItem {
  id: number;
  title: string;
  summary: string;
  lesson_type: "VIDEO" | "LIVE" | "ARTICLE" | "QUIZ";
  duration_minutes: number;
  is_free_preview: boolean;
  preview_video_url?: string | null;
  stream_url?: string;
  content_markdown?: string;
  order: number;
}

export interface ModuleItem {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: LessonItem[];
}

export interface CourseItem {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  short_description: string;
  description?: string;
  duration_weeks: number;
  duration_label: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  delivery_mode: "LIVE" | "RECORDED" | "HYBRID";
  currency: string;
  price: string;
  discount_price: string | null;
  effective_price: string;
  installment_available: boolean;
  installment_summary: string;
  included_features: string[];
  outcomes?: string[];
  tools_covered: string[];
  thumbnail_url: string;
  accent_color: string;
  icon_name: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  module_count: number;
  modules?: ModuleItem[];
}

export interface TechnologyItem {
  id: number;
  name: string;
  category: string;
  description: string;
  icon_key: string;
  display_order: number;
}

export interface ProjectShowcaseItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  architecture_notes: string;
  tech_stack: string[];
  image_url: string;
  course: number | null;
  course_title: string | null;
  course_slug: string | null;
  demo_url: string;
  is_sample_demo: boolean;
}

export interface TrainerProfileItem {
  id: number;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  years_experience: number;
  avatar_url: string;
  linkedin_url: string;
  is_verified: boolean;
}

export interface TestimonialItem {
  id: number;
  student_name: string;
  program_taken: string;
  quote: string;
  rating: number;
  is_verified: boolean;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface PlatformStats {
  published_courses: number;
  total_lessons: number;
  hands_on_projects: number;
  verified_trainers: number;
  active_learners: number;
  learning_modes: string[];
}

export interface EnrollmentItem {
  id: number;
  student: number;
  student_name: string;
  student_email: string;
  course: number;
  course_detail: CourseItem;
  batch: number | null;
  batch_name: string | null;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  progress_percent: number;
  completed_lesson_ids: number[];
  enrolled_at: string;
}

export interface LiveSessionItem {
  id: number;
  batch: number;
  batch_name: string;
  course_title: string;
  title: string;
  description: string;
  platform: string;
  meeting_url: string;
  scheduled_at: string;
  duration_minutes: number;
  recording_url: string;
}

export interface AssignmentItem {
  id: number;
  course: number;
  course_title: string;
  batch: number | null;
  title: string;
  instructions: string;
  due_date: string | null;
  max_score: number;
}

export interface AssignmentSubmissionItem {
  id: number;
  assignment: number;
  assignment_title: string;
  student: number;
  student_name: string;
  submission_url: string;
  notes: string;
  status: "SUBMITTED" | "REVIEWED" | "NEEDS_REVISION";
  score: number | null;
  feedback: string;
  submitted_at: string;
}

export interface QuizItem {
  id: number;
  course: number;
  course_title: string;
  title: string;
  description: string;
  passing_score_percent: number;
  questions: {
    id: number;
    prompt: string;
    options: string[];
    order: number;
  }[];
}

export interface CertificateItem {
  id: number;
  certificate_id: string;
  student: number;
  student_email: string;
  course: number;
  recipient_name: string;
  course_title: string;
  issued_date: string;
  grade_or_remarks: string;
  is_revoked: boolean;
  verification_url: string;
}

export interface PaymentOrderItem {
  id: number;
  order_reference: string;
  student: number;
  student_email: string;
  student_name: string;
  course: number;
  course_title: string;
  course_slug: string;
  provider: string;
  gateway_order_id: string;
  gateway_payment_id: string;
  currency: string;
  amount: string;
  discount_amount: string;
  final_amount: string;
  status: "CREATED" | "PAID" | "FAILED" | "REFUNDED";
  refund_reference: string;
  created_at: string;
  paid_at: string | null;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportRequestItem {
  id: number;
  user: number;
  user_email: string;
  user_name: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  admin_reply: string;
  created_at: string;
}

export interface DemoBookingItem {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  course: number | null;
  course_title: string | null;
  course_interest: string;
  preferred_slot: string;
  experience_level: string;
  notes: string;
  status: "NEW" | "CONTACTED" | "SCHEDULED" | "CONVERTED" | "CLOSED";
  admin_notes: string;
  created_at: string;
}

export interface AdminAnalytics {
  total_students: number;
  active_courses: number;
  total_enrollments: number;
  revenue: number;
  currency: string;
  pending_payments: number;
  demo_registrations: number;
  new_enquiries: number;
}

