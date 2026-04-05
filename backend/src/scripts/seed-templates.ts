/**
 * Seed Script — Generic Section Engine
 * 
 * Seeds reusable section templates into MongoDB.
 * Run via: npx ts-node -r tsconfig-paths/register src/scripts/seed-templates.ts
 * 
 * Pattern: Add new sections here by calling seedSection() with category + HTML + defaultProps.
 * templateBlocks.js in the frontend will auto-discover and register each section as an editor block.
 */

import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// ─── Hero Section HTML (inline for standalone script portability) ─────────────
const HERO_HTML = `
<section style="background:#fff; font-family: 'Inter', 'Segoe UI', sans-serif; padding: 100px 0; overflow: hidden; position: relative;">
    <div style="max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:center; flex-wrap:wrap; gap:60px; position:relative; z-index:1;">
        <!-- Left Content -->
        <div style="flex:1; min-width:320px;">
            <h1 style="font-size:clamp(42px,5vw,64px); font-weight:800; line-height:1.1; color:#0f2a24; margin:0 0 20px 0;">
                <span data-var="hero_headline_part1">Advance Your</span>
                <br>
                <span style="color:#f97316;" data-var="hero_highlight">engineering</span>
                <br>
                <span data-var="hero_headline_part2">skills with us</span>
            </h1>
            <p style="font-size:18px; color:#4b5563; line-height:1.6; margin:0 0 32px 0; max-width:480px;" data-var="hero_subtext">
                Build skills with our courses and mentor from world-class companies.
            </p>
            
            <div style="display:flex; flex-wrap:wrap; gap:24px; margin-bottom:40px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:24px; height:24px; border-radius:50%; background:#ffedd5; display:flex; align-items:center; justify-content:center;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <span style="font-size:14px; font-weight:600; color:#374151;" data-var="hero_benefit_1">Flexible</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:24px; height:24px; border-radius:50%; background:#ffedd5; display:flex; align-items:center; justify-content:center;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <span style="font-size:14px; font-weight:600; color:#374151;" data-var="hero_benefit_2">Learning path</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:24px; height:24px; border-radius:50%; background:#ffedd5; display:flex; align-items:center; justify-content:center;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <span style="font-size:14px; font-weight:600; color:#374151;" data-var="hero_benefit_3">Community</span>
                </div>
            </div>
            
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:12px; max-width:440px; width:100%;">
                <span style="font-size:13px; color:#4b5563; font-weight:500;">What do you learn today?</span>
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="flex:1; display:flex; align-items:center; gap:8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#0f2a24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <select style="background:transparent; border:none; outline:none; font-size:16px; color:#111827; font-weight:700; cursor:pointer; width:100%; -webkit-appearance:none; -moz-appearance:none;">
                            <option data-var="hero_cta_placeholder">Learn Fullstack Javascript</option>
                            <option>Engineering</option><option>Design</option><option>Business</option>
                        </select>
                    </div>
                    <button style="background:#047857; color:#fff; border:none; border-radius:10px; padding:12px 32px; font-size:15px; font-weight:600; cursor:pointer; flex-shrink:0;" data-var="hero_cta_button_text">Start</button>
                </div>
            </div>
        </div>
        
        <!-- Right Media -->
        <div style="flex:1; display:flex; justify-content:center; align-items:center; position:relative; min-height:480px; min-width:320px;">
            <!-- Light orange secondary shape -->
            <div style="position:absolute; width:100%; max-width:500px; height:100%; max-height:500px; background:#ffedd5; right:-30px; border-radius:40px 100px 100px 100px; z-index:0;"></div>
            <!-- Main orange shape -->
            <div style="position:absolute; width:100%; max-width:500px; height:100%; max-height:500px; background:#f97316; border-radius:180px 40px 180px 180px; z-index:1; overflow:hidden; display:flex; align-items:flex-end; justify-content:center;">
                <img data-var-src="hero_illustration" src="https://illustrations.popsy.co/amber/student.svg" alt="Student" style="width:80%; max-width:400px; height:auto; object-fit:contain; object-position:bottom; position:relative; z-index:2; bottom:-10%;" />
            </div>
            
            <!-- Stacked avatars at the very bottom center -->
            <div style="position:absolute; bottom:-16px; left:50%; transform:translateX(-50%); display:flex; z-index:3; background:#fff; padding:6px; border-radius:999px; box-shadow:0 10px 25px rgba(0,0,0,0.1);">
                <img data-var-src="hero_avatar_1" src="https://i.pravatar.cc/40?img=1" alt="Student" style="width:36px; height:36px; border-radius:50%; border:2px solid #fff; object-fit:cover;" />
                <img data-var-src="hero_avatar_2" src="https://i.pravatar.cc/40?img=2" alt="Student" style="width:36px; height:36px; border-radius:50%; border:2px solid #fff; margin-left:-12px; object-fit:cover;" />
                <img data-var-src="hero_avatar_3" src="https://i.pravatar.cc/40?img=3" alt="Student" style="width:36px; height:36px; border-radius:50%; border:2px solid #fff; margin-left:-12px; object-fit:cover;" />
            </div>
        </div>
        
    </div>
</section>`.trim();

// ─── Page Schema (inline for standalone script) ───────────────────────────────
const PageSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    type: { type: String, default: 'page' },
    category: { type: String, default: '' },
    gjsHtml: { type: String, default: '' },
    gjsCss: { type: String, default: '' },
    gjsComponents: { type: [mongoose.Schema.Types.Mixed], default: [] },
    gjsStyles: { type: [mongoose.Schema.Types.Mixed], default: [] },
    gjsAssets: { type: [mongoose.Schema.Types.Mixed], default: [] },
    defaultProps: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, default: 'published' },
    metaDescription: String,
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
}, { timestamps: true });

const PageModel = mongoose.model('Page', PageSchema);

// ─── Course Curriculum HTML ────────────────────────────────────────────────────
const CURRICULUM_HTML = `
<section style="font-family:'Inter','Segoe UI',sans-serif; padding:60px 24px; max-width:1200px; margin:0 auto;">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:32px;">
        <h2 style="font-size:clamp(28px,4vw,42px); font-weight:800; color:#111827; margin:0 0 8px 0;" data-var="curriculum_title">Course Curriculum</h2>
        <p style="font-size:15px; color:#6b7280; margin:0;" data-var="curriculum_subtitle"><strong data-var="curriculum_track_name">Quantitative Track</strong> — <span data-var="curriculum_track_desc">core quantitative topics with intensive practice.</span></p>
    </div>

    <!-- Tab Bar -->
    <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:36px;">
        <button data-tab="quantitative" style="background:#047857; color:#fff; border:2px solid #047857; border-radius:999px; padding:8px 22px; font-size:13px; font-weight:700; cursor:pointer;" data-var="curriculum_tab_1">QUANTITATIVE</button>
        <button data-tab="verbal" style="background:transparent; color:#374151; border:2px solid transparent; border-radius:999px; padding:8px 22px; font-size:13px; font-weight:600; cursor:pointer;" data-var="curriculum_tab_2">VERBAL</button>
        <button data-tab="reasoning" style="background:transparent; color:#374151; border:2px solid transparent; border-radius:999px; padding:8px 22px; font-size:13px; font-weight:600; cursor:pointer;" data-var="curriculum_tab_3">REASONING</button>
        <button data-tab="coding" style="background:transparent; color:#374151; border:2px solid transparent; border-radius:999px; padding:8px 22px; font-size:13px; font-weight:600; cursor:pointer;" data-var="curriculum_tab_4">CODING</button>
        <button data-tab="hr" style="background:transparent; color:#374151; border:2px solid transparent; border-radius:999px; padding:8px 22px; font-size:13px; font-weight:600; cursor:pointer;" data-var="curriculum_tab_5">HR</button>
    </div>

    <!-- Track subtitle -->
    <p style="font-size:13px; color:#374151; margin:0 0 20px 0;"><strong data-var="curriculum_track_name">Quantitative Track</strong> — <span data-var="curriculum_track_desc">core quantitative topics with intensive practice.</span></p>

    <!-- Main Content -->
    <div style="display:flex; gap:32px; align-items:flex-start; flex-wrap:wrap;">

        <!-- LEFT: Module List (Tab Panes) -->
        <div style="flex:2; min-width:280px; position:relative;">
            
            ${[
        { id: 'quantitative', title: 'Quantitative Reasoning' },
        { id: 'verbal', title: 'Verbal Ability' },
        { id: 'reasoning', title: 'Logical Reasoning' },
        { id: 'coding', title: 'Coding & DSA' },
        { id: 'hr', title: 'HR Prep' }
    ].map(track => `
            <div data-tab-pane="${track.id}" style="display:${track.id === 'quantitative' ? 'block' : 'none'};">
                <!-- Module 1 (expanded) -->
                <details data-module open style="margin-bottom:8px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
                    <summary style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; background:#fff; list-style:none; font-weight:700; font-size:14px; color:#111827;">
                        <span style="width:26px; height:26px; background:#047857; color:#fff; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; flex-shrink:0;" data-var="${track.id}_mod1_num">1</span>
                        <span style="flex:1;" data-var="${track.id}_mod1_title">Module 1: ${track.title} basics</span>
                        <span class="mod-chevron">−</span>
                    </summary>
                    <div style="padding:12px 16px 16px 54px; background:#fff; border-top:1px solid #f3f4f6;">
                        <p style="font-size:13px; color:#6b7280; margin:0; line-height:1.6;" data-var="${track.id}_mod1_desc">${track.title} — Includes concept videos, solved examples, and a practice set with solutions.</p>
                    </div>
                </details>

                <!-- Modules 2-8 (collapsed) -->
                ${[2, 3, 4, 5, 6, 7, 8].map(i => `
                <details data-module style="margin-bottom:8px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
                    <summary style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; background:#fff; list-style:none; font-weight:600; font-size:14px; color:#111827;">
                        <span style="width:26px; height:26px; background:#e5e7eb; color:#374151; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;" data-var="${track.id}_mod${i}_num">${i}</span>
                        <span style="flex:1;" data-var="${track.id}_mod${i}_title">Module ${i}: ${track.title} Topic</span>
                        <span class="mod-chevron">›</span>
                    </summary>
                </details>
                `).join('')}
            </div>
            `).join('')}

        </div>

        <!-- RIGHT: What You'll Get Sidebar -->
        <div style="flex:1; min-width:260px; max-width:340px;">

            <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:20px;">
                <h3 style="font-size:16px; font-weight:800; color:#111827; margin:0 0 16px 0;" data-var="benefits_heading">What you'll get</h3>
                <ul style="list-style:none; padding:0; margin:0 0 20px 0; display:flex; flex-direction:column; gap:6px;">
                    <li style="font-size:13px; color:#374151;" data-var="benefit_1">— 🎬 250+ video Lectures</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_2">— 📝 Topic Wise Notes</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_3">— ✅ 500+ Practice Problems</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_4">— How to Crack Technical Interview Course 🧑‍💻</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_5">— HR Interview Course | Sample Answer + Templates</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_6">— ⭐ Trusted by 1000+ Students</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_7">— 👶 Beginner Friendly</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_8">— 📹 10 Lakh+ Video Views on Youtube</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_9">— Mock tests for Wipro, TCS, Accenture &amp; more</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_10">— HR Interview training included</li>
                    <li style="font-size:13px; color:#374151;" data-var="benefit_11">— Progress tracking + completion certificate</li>
                </ul>

                <!-- Banner Image -->
                <img
                    data-var-src="curriculum_banner_image"
                    src="https://placehold.co/300x160/6B3FA0/white?text=Course+2025"
                    alt="Course Banner"
                    style="width:100%; border-radius:8px; margin-bottom:16px; object-fit:cover;"
                />

                <!-- Enroll Button -->
                <a href="#" style="display:block; background:#047857; color:#fff; text-align:center; padding:14px; border-radius:8px; font-weight:700; font-size:15px; text-decoration:none;" data-var="enroll_button_text" data-var-link="enroll_button_link">Enroll Now</a>
            </div>

        </div>
    </div>
</section>`.trim();

// ─── Hero Section 2 HTML (App Launch Style) ──────────────────────────────────
const HERO_SECTION_2_HTML = `
<section style="background:#424c5a; font-family: 'Inter', sans-serif; padding: 100px 0 160px 0; overflow: hidden; position: relative;">
    <div style="max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:center; flex-wrap:wrap; gap:60px; position:relative; z-index:2;">
        <!-- Left Content -->
        <div style="flex:1; min-width:320px;">
            <h1 style="font-size:clamp(42px,5vw,56px); font-weight:800; line-height:1.2; margin:0 0 24px 0;">
                <div style="color:#ffffff;" data-var="hero2_headline_part1">Launch Your App</div>
                <div style="color:#cbd5e1;" data-var="hero2_headline_part2">Grow Your Business</div>
            </h1>
            <p style="font-size:18px; color:#f1f5f9; line-height:1.6; margin:0 0 40px 0; max-width:480px;" data-var="hero2_subtext">
                Amet nunc diam orci duis ut sit diam arcu, nec. Eleifend proin massa tincidunt viverra lectus pulvinar.
            </p>
            <div>
                <a href="#get-started" style="display:inline-block; border:2px solid #ffffff; color:#ffffff; padding:14px 36px; border-radius:999px; font-weight:700; font-size:16px; text-decoration:none; transition:all 0.3s;" data-var="hero2_cta_text" data-var-link="hero2_cta_link">Free Launch</a>
            </div>
        </div>
        <!-- Right Image -->
        <div style="flex:1; display:flex; justify-content:center; align-items:center; min-width:320px;">
            <img data-var-src="hero2_illustration" src="https://placehold.co/600x500/transparent/ffffff?text=App+Mockup+Placeholder" alt="App Mockup" style="width:100%; max-width:560px; height:auto; object-fit:contain;" />
        </div>
    </div>
    <!-- Slanted Bottom -->
    <div style="position:absolute; bottom:-120px; left:-10%; width:120%; height:200px; background:#ffffff; transform:rotate(-4deg); z-index:1;"></div>
</section>`.trim();

// ─── Hero Section 3 HTML (Teach Worldwide Style) ─────────────────────────────
const HERO_SECTION_3_HTML = `
<section style="background:#ffffff; font-family: 'Inter', sans-serif; padding: 100px 0; overflow: hidden; position: relative;">
    <div style="max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:center; flex-wrap:wrap; gap:60px;">
        <!-- Left Content -->
        <div style="flex:1; min-width:320px;">
            <h1 style="font-size:clamp(46px,6vw,64px); font-weight:900; line-height:1.1; color:#0f172a; margin:0 0 24px 0;">
                <span style="position:relative; display:inline-block; margin-right:12px;">
                    <span data-var="hero3_headline_focus" style="position:relative; z-index:2;">Teach</span>
                    <span style="position:absolute; bottom:6px; left:-5px; width:110%; height:14px; background:#ea580c; z-index:1; border-radius:4px; transform:rotate(-2deg);"></span>
                </span>
                <span data-var="hero3_headline_rest">students worldwide</span>
            </h1>
            <p style="font-size:18px; color:#475569; line-height:1.6; margin:0 0 40px 0; max-width:480px;" data-var="hero3_subtext">
                Amet nunc diam orci duis ut sit diam arcu, nec. Eleifend proin massa tincidunt viverra lectus pulvinar. Nunc ipsum est pellentesque turpis ultricies.
            </p>
            
            <div style="display:flex; flex-wrap:wrap; gap:24px; align-items:center; margin-bottom:60px;">
                <a href="#signup" style="background:#ea580c; color:#ffffff; padding:14px 36px; border-radius:6px; font-weight:700; font-size:16px; text-decoration:none;" data-var="hero3_btn_1_text" data-var-link="hero3_btn_1_link">Sign Up Now</a>
                <a href="#demo" style="display:flex; align-items:center; gap:8px; color:#2563eb; font-weight:600; font-size:16px; text-decoration:none;" data-var-link="hero3_btn_2_link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>
                    <span data-var="hero3_btn_2_text">View Demo</span>
                </a>
            </div>
            
            <div>
                <p style="font-size:13px; font-weight:600; color:#64748b; margin:0 0 16px 0;" data-var="hero3_trusted_text">Trusted by leading companies</p>
                <div style="display:flex; align-items:center; gap:24px; flex-wrap:wrap; opacity:0.6;">
                    <img data-var-src="hero3_logo_1" src="https://placehold.co/100x30/transparent/475569?text=Logo+1" alt="Logo" style="height:24px; object-fit:contain;" />
                    <img data-var-src="hero3_logo_2" src="https://placehold.co/100x30/transparent/475569?text=Logo+2" alt="Logo" style="height:24px; object-fit:contain;" />
                    <img data-var-src="hero3_logo_3" src="https://placehold.co/100x30/transparent/475569?text=Logo+3" alt="Logo" style="height:24px; object-fit:contain;" />
                    <img data-var-src="hero3_logo_4" src="https://placehold.co/100x30/transparent/475569?text=Logo+4" alt="Logo" style="height:24px; object-fit:contain;" />
                </div>
            </div>
        </div>
        <!-- Right Image -->
        <div style="flex:1; display:flex; justify-content:center; align-items:center; min-width:320px;">
            <img data-var-src="hero3_illustration" src="https://placehold.co/600x600/transparent/ea580c?text=Blob+Illustration+Placeholder" alt="Illustration" style="width:100%; max-width:600px; height:auto; object-fit:contain;" />
        </div>
    </div>
</section>`.trim();

// ─── Feature Section 2 HTML (Left Text, Right Video) ──────────────────────────
const FEATURE_SECTION_2_HTML = `
<section style="background:#f8fafc; font-family: 'Inter', sans-serif; padding: 100px 0; overflow: hidden;">
    <div style="max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:center; flex-wrap:wrap; gap:60px;">
        <!-- Left Content -->
        <div style="flex:1; min-width:320px;">
            <h2 style="font-size:clamp(32px,5vw,48px); font-weight:800; color:#0f172a; margin:0 0 24px 0;" data-var="feat1_heading">
                Turpis risus facilisi
            </h2>
            <p style="font-size:18px; color:#475569; line-height:1.6; margin:0;" data-var="feat1_desc">
                Augue feugiat mi, massa amet. Id purus aliquam bibendum purus dictum elementum nullam odio tellus. Imperdiet feugiat est odio fames magna orci. Augue purus aliquam, placerat vestibulum dictum pellentesque molestie. Facilisis pretium porta congue proin.
            </p>
        </div>
        <!-- Right Image/Video Graphic -->
        <div style="flex:1; min-width:320px; display:flex; justify-content:center; align-items:center;">
            <img data-var-src="feat1_illustration" src="https://placehold.co/600x400/transparent/334155?text=Video+Thumbnail" alt="Feature Graphic" style="width:100%; max-width:600px; height:auto; object-fit:contain;" />
        </div>
    </div>
</section>`.trim();

// ─── Feature Section 3 HTML (Left Image, Right Text) ──────────────────────────
const FEATURE_SECTION_3_HTML = `
<section style="background:#f8fafc; font-family: 'Inter', sans-serif; padding: 100px 0; overflow: hidden;">
    <div style="max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:center; flex-wrap:wrap-reverse; gap:60px;">
        <!-- Left Image Graphic -->
        <div style="flex:1; min-width:320px; display:flex; justify-content:center; align-items:center;">
            <img data-var-src="feat2_illustration" src="https://placehold.co/600x500/transparent/334155?text=Phone+Composition" alt="Feature Graphic" style="width:100%; max-width:500px; height:auto; object-fit:contain;" />
        </div>
        <!-- Right Content -->
        <div style="flex:1; min-width:320px;">
            <h2 style="font-size:clamp(32px,5vw,48px); font-weight:800; color:#0f172a; margin:0 0 24px 0;" data-var="feat2_heading">
                Sagittis sapien viverra
            </h2>
            <p style="font-size:18px; color:#475569; line-height:1.6; margin:0;" data-var="feat2_desc">
                Id turpis ante nunc, id tempor. Diam, eros, eget suspendisse dolor tellus. Diam fringilla sed volutpat facilisi. Pulvinar vulputate facilisis vel eros. Auctor metus sed auctor tortor sed nulla. Urna massa eu vel blandit sed nisi gravida. Imperdiet parturient at purus bibendum risus auctor lacus tristique arcu. Arcu hac cursus faucibus id. Eu integer parturient risus magna eget massa. Risus molestie tempor, faucibus non ultricies. Nam vel mattis quis dui, condimentum mi volutpat ut aliquam.
            </p>
        </div>
    </div>
</section>`.trim();

// ─── Feature Section 4 HTML (Gradient CTA) ────────────────────────────────────
const CTA_SECTION_1_HTML = `
<section style="font-family: 'Inter', sans-serif; padding: 60px 24px; display: flex; justify-content: center;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #701a75 100%); border-radius: 24px; padding: 64px 24px; max-width: 1000px; width: 100%; text-align: center; color: #ffffff; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <h2 style="font-size: clamp(32px, 5vw, 48px); font-weight: 800; margin: 0 0 20px 0; line-height: 1.2;" data-var="cta1_heading">
            Join the community today
        </h2>
        <p style="font-size: 16px; color: #e2e8f0; line-height: 1.6; max-width: 600px; margin: 0 auto 32px auto;" data-var="cta1_desc">
            Egestas fringilla aliquam leo, habitasse arcu varius lorem elit. Neque pellentesque donec et tellus ac varius tortor, bibendum. Nulla felis ac turpis at amet. Purus malesuada placerat arcu at enim elit in accumsan.
        </p>
        <a href="#signup" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; text-decoration: none; transition: background 0.2s;" data-var-link="cta1_btn_link">
            <span data-var="cta1_btn_text">Sign Up Free</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
    </div>
</section>`.trim();

// ─── Why Join Us HTML ────────────────────────────────────────────────────────
const WHY_JOIN_US_HTML = `
<section style="background-color:#FDFBF7; padding:100px 24px; font-family:'Inter', 'Segoe UI', sans-serif; display:flex; justify-content:center; overflow:hidden;">
    <div style="max-width:1100px; width:100%; background:#fff; border-radius:24px; box-shadow:0 20px 40px rgba(0,0,0,0.04); display:flex; flex-wrap:wrap; position:relative; z-index:1;">
        
        <!-- Left Content -->
        <div style="flex:1; min-width:320px; padding:60px 48px; display:flex; flex-direction:column; justify-content:center;">
            <h2 style="font-size:clamp(32px, 4vw, 42px); font-weight:800; color:#0f172a; margin:0 0 24px 0; line-height:1.2;" data-var="why_heading">Why join us</h2>
            
            <ul style="list-style:none; padding:0; margin:0 0 32px 0; display:flex; flex-direction:column; gap:16px;">
                <li style="display:flex; align-items:flex-start; gap:12px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="flex-shrink:0; margin-top:2px;">
                        <path d="M5 13l4 4L19 7" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span style="font-size:16px; color:#475569; line-height:1.6;" data-var="why_bullet_1">Est et in pharetra magna adipiscing ornare aliquam.</span>
                </li>
                <li style="display:flex; align-items:flex-start; gap:12px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="flex-shrink:0; margin-top:2px;">
                        <path d="M5 13l4 4L19 7" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span style="font-size:16px; color:#475569; line-height:1.6;" data-var="why_bullet_2">Tellus arcu sed consequat ac velit ut eu blandit.</span>
                </li>
                <li style="display:flex; align-items:flex-start; gap:12px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="flex-shrink:0; margin-top:2px;">
                        <path d="M5 13l4 4L19 7" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span style="font-size:16px; color:#475569; line-height:1.6;" data-var="why_bullet_3">Ullamcorper ornare in et egestas dolor orci.</span>
                </li>
            </ul>

            <div>
                <a href="#signup" data-var-link="why_btn_link" style="display:inline-block; border:2px solid #047857; background:#047857; color:#fff; font-weight:700; font-size:16px; padding:12px 32px; border-radius:8px; text-decoration:none; transition:all 0.2s;" data-var="why_btn_text">Sign up now</a>
            </div>
        </div>

        <!-- Right Media / Video Placeholder -->
        <div style="flex:1; min-width:320px; position:relative; min-height:400px; display:flex; align-items:center; justify-content:center; padding: 24px;">
            <!-- Background Shapes (Absolute) -->
            <div style="position:absolute; width:180px; height:180px; background:#ffedd5; transform:rotate(45deg); right:10%; top:20px; z-index:0; pointer-events:none;"></div>
            <div style="position:absolute; width:160px; height:160px; background:#047857; border-radius:32px; right:5%; bottom:40px; opacity:0.8; z-index:0; pointer-events:none;"></div>
            <div style="position:absolute; width:64px; height:64px; background:#10b981; border-radius:50%; left:10%; bottom:80px; z-index:0; pointer-events:none;"></div>
            <div style="position:absolute; width:48px; height:48px; background:#f97316; border-radius:50%; right:20%; top:20px; z-index:0; pointer-events:none;"></div>

            <!-- Video Player Window -->
            <div style="position:relative; z-index:1; background:#fff; border-radius:12px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); width:100%; max-width:500px; overflow:hidden; border:1px solid #e2e8f0;">
                <!-- Browser Header -->
                <div style="height:32px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; padding:0 12px; gap:6px;">
                    <div style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div>
                    <div style="width:10px; height:10px; border-radius:50%; background:#eab308;"></div>
                    <div style="width:10px; height:10px; border-radius:50%; background:#22c55e;"></div>
                </div>
                <!-- Iframe -->
                <div style="position:relative; padding-bottom:56.25%; height:0; background:#000;">
                    <iframe data-var-video="why_video_url" src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        </div>
        
    </div>
</section>
`.trim();

// ─── Testimonials HTML ───────────────────────────────────────────────────────
const buildTestimonialsHTML = () => {
    let cardsHTML = '';
    for (let i = 1; i <= 6; i++) {
        cardsHTML += `
            <div data-testimonial style="flex:0 0 320px; background:#fff; border-radius:16px; padding:32px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #f1f5f9; display:flex; flex-direction:column; min-height:280px; scroll-snap-align:start;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                    <img data-var-src="test_t${i}_logo" src="https://placehold.co/40x40/475569/ffffff?text=C${i}" style="width:32px; height:32px; object-fit:contain; border-radius:50%;" />
                    <span style="font-weight:700; font-size:18px; color:#334155; text-transform:uppercase;" data-var="test_t${i}_company">Company ${i}</span>
                </div>
                <p style="font-size:15px; color:#475569; line-height:1.6; flex:1; margin:0 0 32px 0;" data-var="test_t${i}_desc">Aliquam ridiculus mi porta habitant vulputate rhoncus, mattis amet enim. Sit purus venenatis velit semper lectus sed ornare quam nulla.</p>
                <div style="display:flex; align-items:center; gap:16px;">
                    <img data-var-src="test_t${i}_avatar" src="https://i.pravatar.cc/60?img=${i + 10}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
                    <div>
                        <div style="font-weight:700; font-size:15px; color:#1e293b;" data-var="test_t${i}_name">John Doe ${i}</div>
                        <div style="font-size:13px; color:#64748b;" data-var="test_t${i}_role">Co-founder</div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
    <section class="testimonial-section" style="background-color:#FDFBF7; padding:80px 0; font-family:'Inter', 'Segoe UI', sans-serif; overflow:hidden;">
        <style>
            .test-track::-webkit-scrollbar { display: none; }
            .test-track { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
        </style>
        <div style="max-width:1200px; margin:0 auto; padding:0 24px;">
            
            <!-- Header Row -->
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:48px; flex-wrap:wrap; gap:16px;">
                <h2 style="font-size:clamp(32px, 4vw, 48px); font-weight:800; color:#0f2a24; margin:0;" data-var="test_heading">Because they love us</h2>
                <div style="display:flex; gap:16px;">
                    <button class="test-prev" style="width:48px; height:48px; border-radius:50%; border:none; background:#fff; box-shadow:0 4px 10px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#047857; transition:all 0.2s;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="test-next" style="width:48px; height:48px; border-radius:50%; border:none; background:#fff; box-shadow:0 4px 10px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#047857; transition:all 0.2s;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </div>
            
            <!-- Background Green Banner -->
            <div style="position:relative; width:100%; padding-bottom:32px;">
                <div style="position:absolute; top:40px; left:-100vw; right:-100vw; bottom:0; background:#ecfdf5; z-index:0;"></div>
                
                <!-- Cards Container (Scrollable) -->
                <div class="test-track" style="position:relative; z-index:1; display:flex; gap:24px; overflow-x:auto; padding:20px 4px 40px 4px; scroll-behavior:smooth;">
                    ${cardsHTML}
                </div>
            </div>

        </div>
    </section>
    `.trim();
};
const TESTIMONIALS_HTML = buildTestimonialsHTML();

// ── Section Registry ─────────────────────────────────────────────────────────
interface SectionDefinition {
    slug: string;
    title: string;
    category: string;
    html: string;
    css?: string;
    defaultProps: Record<string, any>;
}

const buildCurriculumProps = () => {
    const props: Record<string, any> = {
        curriculum_title: 'Course Curriculum',
        curriculum_subtitle: '',
        curriculum_track_name: 'Quantitative Track',
        curriculum_track_desc: 'core quantitative topics with intensive practice.',
        curriculum_tab_1: 'QUANTITATIVE',
        curriculum_tab_2: 'VERBAL',
        curriculum_tab_3: 'REASONING',
        curriculum_tab_4: 'CODING',
        curriculum_tab_5: 'HR',
        benefits_heading: "What you'll get",
        benefit_1: '— 🎬 250+ video Lectures',
        benefit_2: '— 📝 Topic Wise Notes',
        benefit_3: '— ✅ 500+ Practice Problems',
        benefit_4: '— How to Crack Technical Interview Course 🧑‍💻',
        benefit_5: '— HR Interview Course | Sample Answer + Templates',
        benefit_6: '— ⭐ Trusted by 1000+ Students',
        benefit_7: '— 👶 Beginner Friendly',
        benefit_8: '— 📹 10 Lakh+ Video Views on Youtube',
        benefit_9: '— Mock tests for Wipro, TCS, Accenture & more',
        benefit_10: '— HR Interview training included',
        benefit_11: '— Progress tracking + completion certificate',
        curriculum_banner_image: 'https://placehold.co/300x160/6B3FA0/white?text=Course+2025',
        enroll_button_text: 'Enroll Now',
        enroll_button_link: '#enroll',
    };

    const tracks = [
        { id: 'quantitative', title: 'Quantitative Reasoning' },
        { id: 'verbal', title: 'Verbal Ability' },
        { id: 'reasoning', title: 'Logical Reasoning' },
        { id: 'coding', title: 'Coding & DSA' },
        { id: 'hr', title: 'HR Prep' }
    ];

    tracks.forEach(track => {
        props[`${track.id}_mod1_num`] = '1';
        props[`${track.id}_mod1_title`] = `Module 1: ${track.title} basics`;
        props[`${track.id}_mod1_desc`] = `${track.title} — Includes concept videos, solved examples, and a practice set with solutions.`;
        for (let i = 2; i <= 8; i++) {
            props[`${track.id}_mod${i}_num`] = `${i}`;
            props[`${track.id}_mod${i}_title`] = `Module ${i}: ${track.title} Topic`;
        }
    });

    return props;
};

const SECTIONS: SectionDefinition[] = [
    {
        slug: 'lmt-hero-section',
        title: 'LMT Hero Section',
        category: 'hero',
        html: HERO_HTML,
        css: '',
        defaultProps: {
            hero_badge: '🎓 New Courses Added',
            hero_headline_part1: 'Master',
            hero_highlight: 'engineering',
            hero_headline_part2: 'in days',
            hero_subtext: 'Learn at your own pace with expert-led courses designed for real-world skills.',
            hero_benefit_1: 'Flexible',
            hero_benefit_2: 'Learning Path',
            hero_benefit_3: 'Community',
            hero_cta_placeholder: 'Choose an interest...',
            hero_cta_button_text: 'Start',
            hero_social_proof_text: '1,200+ students enrolled this week',
            hero_illustration: 'https://illustrations.popsy.co/amber/student.svg',
            hero_avatar_1: 'https://i.pravatar.cc/40?img=1',
            hero_avatar_2: 'https://i.pravatar.cc/40?img=2',
            hero_avatar_3: 'https://i.pravatar.cc/40?img=3',
        },
    },
    {
        slug: 'lmt-course-curriculum',
        title: 'Course Curriculum',
        category: 'curriculum',
        html: CURRICULUM_HTML,
        css: '',
        defaultProps: buildCurriculumProps(),
    },
    {
        slug: 'lmt-why-join-us',
        title: 'Why Join Us',
        category: 'features',
        html: WHY_JOIN_US_HTML,
        css: '',
        defaultProps: {
            why_heading: 'Why join us',
            why_bullet_1: 'Est et in pharetra magna adipiscing ornare aliquam.',
            why_bullet_2: 'Tellus arcu sed consequat ac velit ut eu blandit.',
            why_bullet_3: 'Ullamcorper ornare in et egestas dolor orci.',
            why_btn_text: 'Sign up now',
            why_btn_link: '#signup',
            why_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
    },
    {
        slug: 'lmt-testimonials',
        title: 'Testimonials Slider',
        category: 'testimonials',
        html: TESTIMONIALS_HTML,
        css: '',
        defaultProps: {
            test_heading: 'Because they love us',
            // Default props are dynamically injected inside templateRef.js automatically
            // via the loop `prop_test_t1_company`, so we don't strictly need to hardcode them all here,
            // but we can let templateRef.js auto-detect them from the DOM strings!
        },
    },
    {
        slug: 'lmt-hero-app-launch',
        title: 'Hero: App Launch',
        category: 'hero',
        html: HERO_SECTION_2_HTML,
        css: '',
        defaultProps: {
            hero2_headline_part1: 'Launch Your App',
            hero2_headline_part2: 'Grow Your Business',
            hero2_subtext: 'Amet nunc diam orci duis ut sit diam arcu, nec. Eleifend proin massa tincidunt viverra lectus pulvinar.',
            hero2_cta_text: 'Free Launch',
            hero2_cta_link: '#get-started',
            hero2_illustration: 'https://placehold.co/600x500/transparent/ffffff?text=App+Mockup+Placeholder',
        },
    },
    {
        slug: 'lmt-hero-teach',
        title: 'Hero: Teach Worldwide',
        category: 'hero',
        html: HERO_SECTION_3_HTML,
        css: '',
        defaultProps: {
            hero3_headline_focus: 'Teach',
            hero3_headline_rest: 'students worldwide',
            hero3_subtext: 'Amet nunc diam orci duis ut sit diam arcu, nec. Eleifend proin massa tincidunt viverra lectus pulvinar. Nunc ipsum est pellentesque turpis ultricies.',
            hero3_btn_1_text: 'Sign Up Now',
            hero3_btn_1_link: '#signup',
            hero3_btn_2_text: 'View Demo',
            hero3_btn_2_link: '#',
            hero3_trusted_text: 'Trusted by leading companies',
            hero3_logo_1: 'https://placehold.co/100x30/transparent/475569?text=Logo+1',
            hero3_logo_2: 'https://placehold.co/100x30/transparent/475569?text=Logo+2',
            hero3_logo_3: 'https://placehold.co/100x30/transparent/475569?text=Logo+3',
        },
    },
    {
        slug: 'lmt-feature-video',
        title: 'Feature: Video Focus',
        category: 'features',
        html: FEATURE_SECTION_2_HTML,
        css: '',
        defaultProps: {
            feat1_heading: 'Turpis risus facilisi',
            feat1_desc: 'Augue feugiat mi, massa amet. Id purus aliquam bibendum purus dictum elementum nullam odio tellus. Imperdiet feugiat est odio fames magna orci. Augue purus aliquam, placerat vestibulum dictum pellentesque molestie. Facilisis pretium porta congue proin.',
            feat1_illustration: 'https://placehold.co/600x400/transparent/334155?text=Video+Thumbnail',
        },
    },
    {
        slug: 'lmt-feature-composition',
        title: 'Feature: Image Composition',
        category: 'features',
        html: FEATURE_SECTION_3_HTML,
        css: '',
        defaultProps: {
            feat2_heading: 'Sagittis sapien viverra',
            feat2_desc: 'Id turpis ante nunc, id tempor. Diam, eros, eget suspendisse dolor tellus. Diam fringilla sed volutpat facilisi. Pulvinar vulputate facilisis vel eros. Auctor metus sed auctor tortor sed nulla. Urna massa eu vel blandit sed nisi gravida. Imperdiet parturient at purus bibendum risus auctor lacus tristique arcu. Arcu hac cursus faucibus id. Eu integer parturient risus magna eget massa. Risus molestie tempor, faucibus non ultricies. Nam vel mattis quis dui, condimentum mi volutpat ut aliquam.',
            feat2_illustration: 'https://placehold.co/600x500/transparent/334155?text=Image+Composition',
        },
    },
    {
        slug: 'lmt-feature-cta-join',
        title: 'Feature: Gradient CTA',
        category: 'features',
        html: CTA_SECTION_1_HTML,
        css: '',
        defaultProps: {
            cta1_heading: 'Join the community today',
            cta1_desc: 'Egestas fringilla aliquam leo, habitasse arcu varius lorem elit. Neque pellentesque donec et tellus ac varius tortor, bibendum. Nulla felis ac turpis at amet. Purus malesuada placerat arcu at enim elit in accumsan.',
            cta1_btn_text: 'Sign Up Free',
            cta1_btn_link: '#',
        },
    },
];

// ─── Course Detail Page HTML ──────────────────────────────────────────────────
const COURSE_DETAIL_HTML = `
<div style="font-family:'Inter','Segoe UI',sans-serif; background:#f8fafc; min-height:100vh;">

    <!-- Main Layout: Left Sidebar + Right Content -->
    <div style="max-width:1400px; margin:0 auto; padding:24px 16px; display:flex; gap:32px; align-items:flex-start;">
 
        <!-- Left Sidebar Nav -->
        <aside style="width:260px; flex-shrink:0; background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:12px 0; position:sticky; top:100px; max-height:calc(100vh - 120px); overflow-y:auto; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="padding:10px 16px 6px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#94a3b8;" data-var="course_sidebar_heading">TCS NQT MENU</div>
            <nav data-sidebar-nav style="display:flex; flex-direction:column; margin-top:4px;">
                <a data-sidebar-item="1" href="#section-1" style="display:flex; align-items:center; gap:8px; padding:12px 16px; text-decoration:none; color:#063f78; font-size:14px; font-weight:600; border-left:3px solid #063f78; background:#f0f9ff; transition:all 0.2s;">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#063f78" stroke-width="2"/><path d="M7 7h10M7 12h10M7 17h6" stroke="#063f78" stroke-width="2" stroke-linecap="round"/></svg>
                    <span data-var="course_nav1_label">Placement Papers</span>
                </a>
                <a data-sidebar-item="2" href="#section-2" style="display:flex; align-items:center; gap:8px; padding:12px 16px; text-decoration:none; color:#374151; font-size:14px; font-weight:500; border-left:3px solid transparent; transition:all 0.2s;">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#64748b" stroke-width="2" stroke-linecap="round"/></svg>
                    <span data-var="course_nav2_label">What Is TCS NQT?</span>
                </a>
                <a data-sidebar-item="3" href="#section-3" style="display:flex; align-items:center; gap:8px; padding:12px 16px; text-decoration:none; color:#374151; font-size:14px; font-weight:500; border-left:3px solid transparent; transition:all 0.2s;">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#64748b" stroke-width="2" stroke-linecap="round"/></svg>
                    <span data-var="course_nav3_label">How To Apply</span>
                </a>
                <a data-sidebar-item="4" href="#section-4" style="display:none; align-items:center; gap:8px; padding:12px 16px; text-decoration:none; color:#374151; font-size:14px; font-weight:500; border-left:3px solid transparent; transition:all 0.2s;">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="#64748b" stroke-width="2" stroke-linecap="round"/></svg>
                    <span data-var="course_nav4_label">Extra Section 1</span>
                </a>
                <a data-sidebar-item="5" href="#section-5" style="display:none; align-items:center; gap:8px; padding:12px 16px; text-decoration:none; color:#374151; font-size:14px; font-weight:500; border-left:3px solid transparent; transition:all 0.2s;">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="#64748b" stroke-width="2" stroke-linecap="round"/></svg>
                    <span data-var="course_nav5_label">Extra Section 2</span>
                </a>
                <a data-sidebar-item="6" href="#section-6" style="display:none; align-items:center; gap:8px; padding:12px 16px; text-decoration:none; color:#374151; font-size:14px; font-weight:500; border-left:3px solid transparent; transition:all 0.2s;">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="#64748b" stroke-width="2" stroke-linecap="round"/></svg>
                    <span data-var="course_nav6_label">Extra Section 3</span>
                </a>
            </nav>
        </aside>

        <!-- Right: Sidebar Section Panels (only one visible at a time) -->
        <main style="flex:1; min-width:0;">

            <!-- Breadcrumb (Shared above active section) -->
            <div style="font-size:13px; color:#64748b; margin-bottom:12px; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
                <a href="/home" style="color:#64748b; text-decoration:none;" data-var="course_breadcrumb_home">Home</a>
                <span>›</span>
                <a href="/courses" style="color:#64748b; text-decoration:none;" data-var="course_breadcrumb_parent">TCS NQT</a>
                <span>›</span>
                <a href="/tcs-nqt-papers" style="color:#063f78; text-decoration:none; font-weight:600;" data-var="course_breadcrumb_current">TCS NQT Placement Papers and Questions 2026</a>
            </div>

            <h1 style="font-size:clamp(24px,3.5vw,36px); font-weight:800; color:#0f172a; margin:0 0 24px 0; line-height:1.2;" data-var="course_page_title">TCS NQT Placement Papers and Questions 2026</h1>

            <!-- Panel 1: Placement Papers (active by default) -->
            <div data-sidebar-section="1" style="display:block;">

                <!-- Inner Content Tabs (for scrolling to sections) -->
                <nav style="display:flex; align-items:center; overflow-x:auto; margin-bottom:24px; border-bottom:1px solid #e2e8f0; -ms-overflow-style:none; scrollbar-width:none; position:sticky; top:100px; background:#fff; z-index:10; padding-top:4px;" data-content-tabs-bar>
                    <a data-content-tab="1" href="#ct-1" style="padding:10px 16px; text-decoration:none; color:#063f78; font-size:14px; font-weight:700; border-bottom:2px solid #063f78; background:#f0f9ff; white-space:nowrap; flex-shrink:0;" data-var="course_tab1_label">Overview</a>
                    <a data-content-tab="2" href="#ct-2" style="padding:10px 16px; text-decoration:none; color:#64748b; font-size:14px; font-weight:600; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;" data-var="course_tab2_label">Syllabus</a>
                    <a data-content-tab="3" href="#ct-3" style="padding:10px 16px; text-decoration:none; color:#64748b; font-size:14px; font-weight:600; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;" data-var="course_tab3_label">Prepare</a>
                    <a data-content-tab="4" href="#ct-4" style="padding:10px 16px; text-decoration:none; color:#64748b; font-size:14px; font-weight:600; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;" data-var="course_tab4_label">Interview</a>
                    <a data-content-tab="5" href="#ct-5" style="padding:10px 16px; text-decoration:none; color:#64748b; font-size:14px; font-weight:600; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;" data-var="course_tab5_label">Video</a>
                </nav>

                <!-- Cards for each subsection -->
                <section id="ct-1" data-content-section="1" style="margin-bottom:28px;">
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                        <div data-var-html="course_section1_content">
                            <h2 style="font-size:20px; font-weight:700; color:#0f172a; margin:0 0 14px 0;">TCS NQT Placement Papers and Questions 2026</h2>
                            <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 14px 0;">TCS NQT Written Test Questions and pattern based practice problems are available on this page. <strong>Test Pattern</strong> has been changed for the TCS NQT as some sections have been replaced with new sections.</p>
                            <ul style="padding-left:20px; color:#475569; font-size:15px; line-height:2;">
                                <li>Pattern-based questions with detailed solutions</li>
                                <li>Previous year question papers included</li>
                                <li>Topic-wise practice sets</li>
                                <li>Updated for the latest exam format</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="ct-2" data-content-section="2" style="margin-bottom:28px;">
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                        <div data-var-html="course_section2_content">
                            <h2 style="font-size:20px; font-weight:700; color:#0f172a; margin:0 0 14px 0;">Syllabus</h2>
                            <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 14px 0;">The complete syllabus covers quantitative aptitude, verbal ability, reasoning, and programming logic.</p>
                            <ul style="padding-left:20px; color:#475569; font-size:15px; line-height:2;">
                                <li>Quantitative Aptitude</li>
                                <li>Verbal Ability &amp; English</li>
                                <li>Reasoning Ability</li>
                                <li>Programming Logic (Coding)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="ct-3" data-content-section="3" style="margin-bottom:28px;">
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                        <div data-var-html="course_section3_content">
                            <h2 style="font-size:20px; font-weight:700; color:#0f172a; margin:0 0 14px 0;">How to Prepare</h2>
                            <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 14px 0;">Follow this step-by-step preparation guide to maximize your score.</p>
                            <ol style="padding-left:20px; color:#475569; font-size:15px; line-height:2;">
                                <li>Understand the exam pattern</li>
                                <li>Practice topic-wise questions daily</li>
                                <li>Take full-length mock tests</li>
                            </ol>
                        </div>
                    </div>
                </section>

                <section id="ct-4" data-content-section="4" style="margin-bottom:28px;">
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                        <div data-var-html="course_section4_content">
                            <h2 style="font-size:20px; font-weight:700; color:#0f172a; margin:0 0 14px 0;">Interview Preparation</h2>
                            <p style="font-size:15px; color:#374151; line-height:1.8;">After clearing the written test, you face HR and Technical interviews. This section covers the most common questions with model answers.</p>
                        </div>
                    </div>
                </section>

                <section id="ct-5" data-content-section="5" style="margin-bottom:28px;">
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                        <div data-var-html="course_section5_content">
                            <h2 style="font-size:20px; font-weight:700; color:#0f172a; margin:0 0 14px 0;">Video Tutorials</h2>
                            <p style="font-size:15px; color:#374151; line-height:1.8;">Watch our curated video tutorials to understand complex topics with ease.</p>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Panel 2: What Is TCS NQT? (hidden by default) -->
            <div data-sidebar-section="2" style="display:none;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <div data-var-html="course_nav2_content">
                        <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">About TCS NQT</h2>
                        <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 12px 0;">TCS National Qualifier Test (NQT) is a standardized assessment conducted by Tata Consultancy Services to evaluate candidates for entry-level technology roles.</p>
                        <h3 style="font-size:16px; font-weight:600; color:#0f172a; margin:16px 0 8px;">Key Features</h3>
                        <ul style="padding-left:20px; color:#475569; font-size:15px; line-height:2;">
                            <li>Open to all graduates from any stream</li>
                            <li>Held multiple times a year</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Panel 3: How To Apply (hidden by default) -->
            <div data-sidebar-section="3" style="display:none;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <div data-var-html="course_nav3_content">
                        <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">Application Process</h2>
                        <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 12px 0;">Follow these steps to apply for the TCS NQT examination.</p>
                    </div>
                </div>
            </div>

            <!-- Panel 4: Extra 1 (hidden by default) -->
            <div data-sidebar-section="4" style="display:none;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <div data-var-html="course_nav4_content">
                        <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">Extra Section 1</h2>
                        <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 12px 0;">Additional content can go here.</p>
                    </div>
                </div>
            </div>

            <!-- Panel 5: Extra 2 (hidden by default) -->
            <div data-sidebar-section="5" style="display:none;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <div data-var-html="course_nav5_content">
                        <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">Extra Section 2</h2>
                        <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 12px 0;">Additional content can go here.</p>
                    </div>
                </div>
            </div>

            <!-- Panel 6: Extra 3 (hidden by default) -->
            <div data-sidebar-section="6" style="display:none;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:28px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <div data-var-html="course_nav6_content">
                        <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">Extra Section 3</h2>
                        <p style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 12px 0;">Additional content can go here.</p>
                    </div>
                </div>
            </div>

        </main>
    </div>
</div>
<script>
(function() {
    // ── Self-Initializing Interactivity for Course Detail ────────────────────
    const root = document.currentScript ? document.currentScript.parentElement : document;
    
    function init() {
        const sidebarItems = root.querySelectorAll('[data-sidebar-item]');
        const sidebarSections = root.querySelectorAll('[data-sidebar-section]');
        const tabBtns = root.querySelectorAll('[data-content-tab]');
        const contentSections = root.querySelectorAll('[data-content-section]');
        
        if (!sidebarItems.length) return;

        const BRAND_BLUE = '#063f78';
        const LIGHT_BLUE = '#f0f9ff';
        const TEXT_DARK = '#0f172a';
        const TEXT_MUTED = '#64748b';
        const TEXT_REGULAR = '#374151';

        // ── Highlight Sidebar ────────────────────────────────────────────────
        const activateSidebar = (idx) => {
            sidebarItems.forEach((item, i) => {
                const isActive = (i + 1) == idx;
                item.style.borderLeftColor = isActive ? BRAND_BLUE : 'transparent';
                item.style.background = isActive ? LIGHT_BLUE : 'transparent';
                item.style.color = isActive ? BRAND_BLUE : TEXT_REGULAR;
                item.style.fontWeight = isActive ? '600' : '500';
                
                const svg = item.querySelector('svg');
                if (svg) {
                    svg.childNodes.forEach(node => {
                        if (node.setAttribute) node.setAttribute('stroke', isActive ? BRAND_BLUE : TEXT_MUTED);
                    });
                }
            });
            sidebarSections.forEach(s => {
                s.style.display = s.getAttribute('data-sidebar-section') == idx ? 'block' : 'none';
            });
            // Auto-reset to Overview tab when switching sidebar sections
            activateTab(1);
        };

        // ── Highlight Content Tab ────────────────────────────────────────────
        const activateTab = (idx) => {
            tabBtns.forEach((btn) => {
                const isActive = btn.getAttribute('data-content-tab') == idx;
                btn.style.borderBottomColor = isActive ? BRAND_BLUE : 'transparent';
                btn.style.color = isActive ? BRAND_BLUE : TEXT_MUTED;
                btn.style.fontWeight = isActive ? '700' : '600';
                btn.style.background = isActive ? LIGHT_BLUE : 'transparent';
            });
        };

        // ── Interaction Handlers ─────────────────────────────────────────────
        sidebarItems.forEach((item, i) => {
            item.onclick = (e) => {
                if (item.getAttribute('href').startsWith('#')) e.preventDefault();
                activateSidebar(i + 1);
            };
        });

        tabBtns.forEach((btn) => {
            btn.onclick = (e) => {
                const href = btn.getAttribute('href');
                if (href && href.startsWith('#')) {
                    // Smooth scroll to the target
                    const target = root.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const offset = 120; // Sticky header offset
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = target.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                }
            };
        });

        // ── Scrollspy System ────────────────────────────────────────────────
        // Use IntersectionObserver to highlight tabs/sidebar as user scrolls
        const observerOptions = {
            root: null,
            rootMargin: '-150px 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('data-content-section');
                    if (id) activateTab(id);
                }
            });
        }, observerOptions);

        contentSections.forEach(section => observer.observe(section));

        // ── Initial State ───────────────────────────────────────────────────
        // Small delay to ensure all DOM styles are painted
        setTimeout(() => {
            activateSidebar(1);
            activateTab(1);
        }, 100);
    }

    // Run after a short delay to ensure DOM is ready if injected dynamically
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 200);
    }
})();
</script>
`;


// ─── Additional SECTIONS appended ────────────────────────────────────────────
const EXTRA_SECTIONS: SectionDefinition[] = [
    {
        slug: 'lmt-course-detail-page',
        title: 'Course Detail Page',
        category: 'pages',
        html: COURSE_DETAIL_HTML,
        css: `
/* Smooth scroll */
html { scroll-behavior: smooth; }

/* Responsive adjustments */
@media (max-width: 991px) {
    /* Main container should still be flex but column for mobile */
    div[style*="max-width:1400px"] { flex-direction: column !important; padding: 0 !important; gap: 0 !important; }
    
    /* Sidebar as a horizontal scrollable strip - Sticky at top */
    aside { 
        width: 100% !important; 
        position: sticky !important; 
        top: 0 !important; 
        z-index: 100 !important; 
        margin-bottom: 0 !important; 
        max-height: none !important; 
        border-radius: 0 !important; 
        border-left: 0 !important; 
        border-right: 0 !important; 
        border-top: 0 !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
        background: #fff !important;
    }
    aside [data-var="course_sidebar_heading"] { display: none !important; }
    nav[data-sidebar-nav] { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; overflow-x: auto !important; -ms-overflow-style:none; scrollbar-width:none; padding: 0 8px !important; }
    nav[data-sidebar-nav]::-webkit-scrollbar { display: none; }
    [data-sidebar-item] { flex-shrink: 0 !important; border-left: 0 !important; border-bottom: 3px solid transparent !important; padding: 14px 16px !important; }
    
    /* Content Area */
    main { width: 100% !important; padding: 16px !important; }
    
    /* Breadcrumbs/Title - ensure left aligned */
    div[style*="margin-bottom:12px"] { justify-content: flex-start !important; text-align: left !important; }
    h1[data-var="course_page_title"] { text-align: left !important; margin: 8px 0 20px 0 !important; font-size: 24px !important; }

    /* Tabs - Sticky below the sidebar */
    [data-content-tabs-bar] { 
        position: sticky !important; 
        top: 47px !important; /* height of sidebar menu */
        flex-wrap: nowrap !important; 
        overflow-x: auto !important; 
        z-index: 99 !important; 
        background: #fff !important; 
        margin: -16px -16px 20px -16px !important; /* Negative margin to bleed to edges */
        padding: 0 16px !important;
        border-bottom: 1px solid #e2e8f0 !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
    }
}

/* Rich content typography */
[data-var-html] h2 { font-size: 20px; font-weight: 700; color:#0f172a; margin: 0 0 16px 0; }
[data-var-html] h3 { font-size: 18px; font-weight: 600; color:#0f172a; margin: 16px 0 10px 0; }
[data-var-html] p { font-size: 15px; color:#374151; line-height: 1.8; margin: 0 0 14px 0; }
[data-var-html] ul, [data-var-html] ol { padding-left: 20px; color:#475569; font-size: 15px; line-height: 2; margin-bottom: 20px; }
[data-var-html] a { color:#063f78; text-decoration: underline; }
[data-var-html] strong { color:#0f172a; }
`,
        defaultProps: {
            course_sidebar_heading: 'TCS NQT MENU',
            course_breadcrumb_home: 'Home',
            course_breadcrumb_parent: 'TCS NQT',
            course_breadcrumb_current: 'TCS NQT Placement Papers and Questions 2026',
            course_page_title: 'TCS NQT Placement Papers and Questions 2026',
            course_nav1_label: 'Placement Papers',
            course_nav2_label: 'What Is TCS NQT?',
            course_nav3_label: 'How To Apply',
            course_nav4_label: 'Extra Section 1',
            course_nav5_label: 'Extra Section 2',
            course_nav6_label: 'Extra Section 3',
            course_section1_content: '<h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 16px 0;">TCS NQT Placement Papers and Questions 2026</h2><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 14px 0;">TCS NQT Written Test Questions and pattern based practice problems are available on this page. <strong>Test Pattern</strong> has been updated for the latest exam cycle.</p><ul style="padding-left:20px;color:#475569;font-size:15px;line-height:2;"><li>Pattern-based questions with detailed solutions</li><li>Previous year question papers included</li><li>Topic-wise practice sets</li></ul>',
            course_section2_content: '<h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 16px 0;">Syllabus</h2><p style="font-size:15px;color:#374151;line-height:1.8;">The complete syllabus covers quantitative aptitude, verbal ability, reasoning, and programming logic.</p>',
            course_section3_content: '<h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 16px 0;">How to Prepare</h2><p style="font-size:15px;color:#374151;line-height:1.8;">Follow this step-by-step preparation guide to maximize your score.</p>',
            course_section4_content: '<h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 16px 0;">Interview Prep</h2><p style="font-size:15px;color:#374151;line-height:1.8;">Key interview questions and strategies for NQT.</p>',
            course_section5_content: '<h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 16px 0;">Video Tutorials</h2><p style="font-size:15px;color:#374151;line-height:1.8;">Watch our curated video tutorials.</p>',
            course_nav2_content: '<h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">About TCS NQT</h2><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 12px 0;">The NQT is a standardized assessment to evaluate candidates for technology roles.</p>',
            course_nav3_content: '<h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">How to Apply</h2><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 12px 0;">Register on the official portal and select your slot.</p>',
            course_nav4_content: '<h2>Extra Section 1 Content</h2><p>Default content for nav 4.</p>',
            course_nav5_content: '<h2>Extra Section 2 Content</h2><p>Default content for nav 5.</p>',
            course_nav6_content: '<h2>Extra Section 3 Content</h2><p>Default content for nav 6.</p>',
            prop_active_sidebar: '1',
            prop_active_tab: '1',
        },
    },
];

const ALL_SECTIONS = [...SECTIONS, ...EXTRA_SECTIONS];

// ─── Seeder ───────────────────────────────────────────────────────────────────
async function seedSection(section: SectionDefinition, force = false) {
    const existing = await PageModel.findOne({ slug: section.slug, type: 'template' });
    if (existing) {
        if (force) {
            // Force-update: refresh HTML, defaultProps, and category
            await PageModel.updateOne({ _id: existing._id }, {
                gjsHtml: section.html,
                gjsCss: section.css || '',
                defaultProps: section.defaultProps,
                category: section.category,
            });
            console.log(`  🔄 Updated:  ${section.title} (${existing._id})`);
        } else {
            console.log(`  ⏭  Skipped(already exists): ${section.title} `);
        }
        return existing;
    }

    const doc = await new PageModel({
        title: section.title,
        slug: section.slug,
        type: 'template',
        category: section.category,
        gjsHtml: section.html,
        gjsCss: section.css || '',
        gjsComponents: [],
        defaultProps: section.defaultProps,
        status: 'published',
    }).save();

    console.log(`  ✅ Created: ${section.title} (${doc._id})`);
    return doc;
}

async function main() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is not set. Check .env file.');
    }

    const force = process.argv.includes('--force');
    console.log(`\n🌱 Seeding Section Templates${force ? ' (force-update mode)' : ''}...\n`);
    await mongoose.connect(mongoUri);

    for (const section of ALL_SECTIONS) {
        await seedSection(section, force);
    }

    await mongoose.disconnect();
    console.log('\n✅ Seeding complete.\n');
}

main().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
