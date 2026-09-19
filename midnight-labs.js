/* =========================================================
   🐧 Midnight — Practical Cyber Labs
   File: midnight-labs.js
   Training / Simulation Only
   ========================================================= */

(() => {
  "use strict";

  const LAB_XP = {
    bank: 150,
    phishing: 100,
    soc: 100,
    endpoint: 100,
    web: 100
  };

  const BANK = {
    id: "bank",
    title: "Nexora Capital Bank",
    subtitle: "Incident Response Investigation",
    difficulty: "Advanced",
    xp: 150,
    caseId: "NCB-IR-2026-0919",
    severity: "HIGH",
    network: "10.44.18.0/24",

    hosts: [
      ["auth-gw-01", "10.44.18.10", "443/tcp", "https"],
      ["portal-02", "10.44.18.20", "443/tcp", "https"],
      ["ledger-api-01", "10.44.18.30", "443/tcp", "https"],
      ["soc-jump-01", "10.44.18.40", "22/tcp", "ssh"]
    ],

    logs: [
      "[2026-09-19 08:41:02] AUTH SUCCESS user=finance.ops src=10.44.18.34 device=WS-17",
      "[2026-09-19 08:44:18] AUTH FAILED user=finance.ops src=203.0.113.77 device=unknown",
      "[2026-09-19 08:44:22] AUTH SUCCESS user=finance.ops src=203.0.113.77 device=unknown mfa=approved",
      "[2026-09-19 08:45:07] WEB LOGIN user=finance.ops src=203.0.113.77 app=portal-02",
      "[2026-09-19 08:47:13] API ACCESS user=finance.ops src=203.0.113.77 endpoint=/internal/ledger",
      "[2026-09-19 08:49:55] ALERT rule=impossible-travel severity=high"
    ],

    nmap: [
      "Nmap 7.95 (SIMULATION)",
      "Target: ncb.local",
      "Host discovery: 4 hosts",
      "auth-gw-01 10.44.18.10 443/tcp open https",
      "portal-02 10.44.18.20 443/tcp open https",
      "ledger-api-01 10.44.18.30 443/tcp open https",
      "soc-jump-01 10.44.18.40 22/tcp open ssh"
    ],

    questions: [
      {
        q: "ما عنوان الـ IP المشبوه في السجلات؟",
        options: [
          "10.44.18.34",
          "10.44.18.10",
          "203.0.113.77",
          "10.44.18.40"
        ],
        answer: "203.0.113.77"
      },
      {
        q: "ما الحساب المرتبط بالنشاط المشبوه؟",
        options: [
          "admin",
          "finance.ops",
          "soc.user",
          "guest"
        ],
        answer: "finance.ops"
      },
      {
        q: "أي نظام يجب إعطاؤه أولوية للتحقيق؟",
        options: [
          "portal-02",
          "soc-jump-01",
          "auth-gw-01",
          "WS-17"
        ],
        answer: "portal-02"
      },
      {
        q: "ما التصنيف الأقرب للحادثة؟",
        options: [
          "Account compromise / unauthorized access",
          "Hardware failure",
          "DNS outage",
          "Normal login"
        ],
        answer: "Account compromise / unauthorized access"
      },
      {
        q: "ما الإجراء الفوري الأنسب؟",
        options: [
          "حذف جميع السجلات",
          "تعطيل أو عزل الحساب والجلسة المتأثرة مع حفظ الأدلة",
          "إيقاف الإنترنت عن كل المستخدمين",
          "تجاهل التنبيه"
        ],
        answer:
          "تعطيل أو عزل الحساب والجلسة المتأثرة مع حفظ الأدلة"
      },
      {
        q: "أي مجموعة أدلة تدعم التحقيق بشكل أفضل؟",
        options: [
          "Auth + Web + Alert logs",
          "صور سطح المكتب فقط",
          "ملفات موسيقى",
          "سجل الطابعة"
        ],
        answer: "Auth + Web + Alert logs"
      }
    ]
  };

  const OTHER_LABS = [
    {
      id: "phishing",
      icon: "fa-envelope",
      title: "Phishing Investigation",
      subtitle: "تحليل رسالة بريد مشبوهة",
      difficulty: "Intermediate",
      xp: 100
    },
    {
      id: "soc",
      icon: "fa-shield-halved",
      title: "SOC Alert Triage",
      subtitle: "تحليل وتنظيم تنبيهات مركز العمليات",
      difficulty: "Intermediate",
      xp: 100
    },
    {
      id: "endpoint",
      icon: "fa-desktop",
      title: "Endpoint Investigation",
      subtitle: "فحص نشاط جهاز داخل بيئة تدريبية",
      difficulty: "Intermediate",
      xp: 100
    },
    {
      id: "web",
      icon: "fa-globe",
      title: "Web Incident",
      subtitle: "تحليل سجلات HTTP واكتشاف النشاط غير المعتاد",
      difficulty: "Intermediate",
      xp: 100
    }
  ];

  function getCompletedLabs() {
    try {
      return JSON.parse(
        localStorage.getItem("midnightLabsCompleted") || "[]"
      );
    } catch {
      return [];
    }
  }

  function saveCompletedLab(id) {
    const completed = getCompletedLabs();

    if (!completed.includes(id)) {
      completed.push(id);
      localStorage.setItem(
        "midnightLabsCompleted",
        JSON.stringify(completed)
      );

      return true;
    }

    return false;
  }

  function addXP(amount) {
    try {
      const current =
        Number(localStorage.getItem("midnightXP") || 0);

      localStorage.setItem(
        "midnightXP",
        String(current + amount)
      );
    } catch {}

    if (typeof window.saveProgress === "function") {
      window.saveProgress();
    }

    if (typeof window.updateStats === "function") {
      window.updateStats();
    }
  }

  function showToast(message) {
    if (typeof window.toast === "function") {
      window.toast(message);
      return;
    }

    const old = document.querySelector(".midnight-lab-toast");

    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "midnight-lab-toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2800);
  }

  function injectStyles() {
    if (document.getElementById("midnightLabsStyles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "midnightLabsStyles";

    style.textContent = `
      .midnight-lab-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        background: #171721;
        color: #fff;
        border: 1px solid rgba(139,92,246,.35);
        padding: 14px 18px;
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,.45);
        font-weight: 700;
        animation: midnightToast .25s ease;
      }

      @keyframes midnightToast {
        from {
          opacity: 0;
          transform: translateY(10px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .lab-warning-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.82);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 999998;
      }

      .lab-warning-box {
        width: min(650px, 100%);
        background: #11111a;
        border: 1px solid rgba(139,92,246,.3);
        border-radius: 24px;
        padding: 28px;
        box-shadow: 0 30px 100px rgba(0,0,0,.6);
        text-align: right;
      }

      .lab-warning-icon {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 18px;
        background: rgba(109,53,255,.15);
        color: #b197fc;
        font-size: 24px;
        margin-bottom: 18px;
      }

      .lab-warning-box h2 {
        margin: 0 0 12px;
        color: #fff;
      }

      .lab-warning-box p {
        color: #a6a6b5;
        line-height: 1.9;
        margin: 0 0 22px;
      }

      .lab-warning-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .lab-warning-actions button {
        border: 0;
        border-radius: 12px;
        padding: 12px 18px;
        cursor: pointer;
        font-family: inherit;
        font-weight: 800;
      }

      .lab-warning-continue {
        background: #6d35ff;
        color: #fff;
      }

      .lab-warning-back {
        background: #22222e;
        color: #fff;
      }

      .labs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
        gap: 18px;
        margin-top: 24px;
      }

      .lab-card {
        position: relative;
        overflow: hidden;
        background: linear-gradient(145deg,#11111a,#171721);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 20px;
        padding: 22px;
        transition: .25s ease;
      }

      .lab-card:hover {
        transform: translateY(-4px);
        border-color: rgba(139,92,246,.45);
      }

      .lab-card.featured {
        grid-column: span 2;
        border-color: rgba(139,92,246,.35);
      }

      .lab-icon {
        width: 52px;
        height: 52px;
        border-radius: 15px;
        display: grid;
        place-items: center;
        background: rgba(109,53,255,.14);
        color: #b197fc;
        font-size: 21px;
        margin-bottom: 18px;
      }

      .lab-card h3 {
        margin: 0 0 8px;
        color: #fff;
      }

      .lab-card p {
        color: #a6a6b5;
        line-height: 1.7;
        margin: 0 0 18px;
      }

      .lab-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 18px;
      }

      .lab-badge {
        font-size: 12px;
        padding: 6px 9px;
        border-radius: 999px;
        background: rgba(255,255,255,.06);
        color: #d9d9e4;
      }

      .lab-open-btn {
        width: 100%;
        border: 0;
        background: #6d35ff;
        color: #fff;
        padding: 12px 16px;
        border-radius: 12px;
        cursor: pointer;
        font-family: inherit;
        font-weight: 800;
      }

      .lab-completed {
        background: rgba(57,217,138,.1);
        color: #39d98a;
      }

      .lab-workspace {
        margin-top: 25px;
        background: #0d0d14;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 22px;
        overflow: hidden;
      }

      .lab-workspace-head {
        padding: 20px;
        border-bottom: 1px solid rgba(255,255,255,.07);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .lab-workspace-head h2 {
        margin: 0;
        color: #fff;
      }

      .lab-close {
        border: 0;
        background: #22222e;
        color: #fff;
        padding: 9px 13px;
        border-radius: 10px;
        cursor: pointer;
        font-family: inherit;
      }

      .lab-terminal {
        background: #050509;
        min-height: 280px;
        padding: 18px;
        font-family: monospace;
        direction: ltr;
        text-align: left;
        overflow: auto;
      }

      .terminal-line {
        color: #cfcfe0;
        line-height: 1.8;
        white-space: pre-wrap;
      }

      .terminal-green {
        color: #39d98a;
      }

      .terminal-purple {
        color: #b197fc;
      }

      .terminal-input-row {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .terminal-input {
        flex: 1;
        min-width: 0;
        background: #11111a;
        color: #fff;
        border: 1px solid rgba(255,255,255,.1);
        padding: 11px;
        border-radius: 10px;
        outline: none;
        font-family: monospace;
      }

      .terminal-run {
        border: 0;
        background: #6d35ff;
        color: #fff;
        border-radius: 10px;
        padding: 0 16px;
        cursor: pointer;
      }

      .lab-questions {
        padding: 22px;
      }

      .lab-question {
        background: #11111a;
        border: 1px solid rgba(255,255,255,.07);
        padding: 18px;
        border-radius: 16px;
        margin-bottom: 14px;
      }

      .lab-question h4 {
        margin: 0 0 14px;
        color: #fff;
        line-height: 1.7;
      }

      .lab-options {
        display: grid;
        gap: 9px;
      }

      .lab-option {
        text-align: right;
        background: #171721;
        color: #dcdce6;
        border: 1px solid rgba(255,255,255,.08);
        padding: 12px;
        border-radius: 11px;
        cursor: pointer;
        font-family: inherit;
      }

      .lab-option.selected {
        border-color: #8b5cf6;
        background: rgba(109,53,255,.14);
      }

      .lab-submit {
        width: 100%;
        border: 0;
        background: #6d35ff;
        color: #fff;
        padding: 14px;
        border-radius: 13px;
        cursor: pointer;
        font-family: inherit;
        font-weight: 900;
        margin-top: 10px;
      }

      .lab-result {
        margin-top: 15px;
        padding: 15px;
        border-radius: 13px;
        line-height: 1.8;
      }

      .lab-result.success {
        background: rgba(57,217,138,.1);
        border: 1px solid rgba(57,217,138,.25);
        color: #39d98a;
      }

      .lab-result.fail {
        background: rgba(255,85,119,.1);
        border: 1px solid rgba(255,85,119,.25);
        color: #ff8da5;
      }

      .simple-lab-content {
        padding: 22px;
      }

      .simple-lab-content pre {
        direction: ltr;
        text-align: left;
        white-space: pre-wrap;
        background: #050509;
        color: #cfcfe0;
        border-radius: 14px;
        padding: 18px;
        overflow: auto;
        line-height: 1.7;
      }

      @media(max-width:700px) {
        .lab-card.featured {
          grid-column: span 1;
        }

        .lab-warning-box {
          padding: 22px;
        }

        .lab-workspace-head {
          align-items: flex-start;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function showWarning(callback) {
    if (
      localStorage.getItem("midnightLabWarningAccepted") === "1"
    ) {
      callback();
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "lab-warning-overlay";

    overlay.innerHTML = `
      <div class="lab-warning-box">

        <div class="lab-warning-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>

        <h2>قبل ما تبدأ الاختبارات العملية</h2>

        <p>
          جميع الاختبارات العملية في Midnight عبارة عن محاكاة
          تدريبية داخل الموقع فقط. الأنظمة والأسماء والسجلات
          والنتائج مصممة للتعلم وليست أنظمة حقيقية.
          لا تستخدم أي أوامر أو معلومات خارج بيئات تملكها
          أو لديك تصريح واضح لاختبارها.
        </p>

        <div class="lab-warning-actions">

          <button class="lab-warning-continue">
            كمل
          </button>

          <button class="lab-warning-back">
            رجوع
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(overlay);

    overlay
      .querySelector(".lab-warning-continue")
      .addEventListener("click", () => {
        localStorage.setItem(
          "midnightLabWarningAccepted",
          "1"
        );

        overlay.remove();
        callback();
      });

    overlay
      .querySelector(".lab-warning-back")
      .addEventListener("click", () => {
        overlay.remove();

        if (typeof window.goBack === "function") {
          window.goBack();
        }
      });
  }

  function renderLabsHub() {
    const hub = document.getElementById("labsHub");

    if (!hub) return;

    const completed = getCompletedLabs();

    hub.innerHTML = `
      <div class="labs-grid">

        <div class="lab-card featured">

          <div class="lab-icon">
            <i class="fa-solid fa-building-columns"></i>
          </div>

          <h3>Nexora Capital Bank</h3>

          <p>
            تحقيق Incident Response داخل بيئة بنك خيالية
            وتحليل سجلات الدخول والشبكة والتنبيهات.
          </p>

          <div class="lab-meta">
            <span class="lab-badge">Advanced</span>
            <span class="lab-badge">+150 XP</span>
            <span class="lab-badge">
              ${completed.includes("bank") ? "مكتمل ✓" : "متاح"}
            </span>
          </div>

          <button
            class="lab-open-btn"
            onclick="openLab('bank')"
          >
            ${completed.includes("bank") ? "إعادة فتح المختبر" : "ابدأ التحقيق"}
          </button>

        </div>

        ${OTHER_LABS.map(lab => `
          <div class="lab-card">

            <div class="lab-icon">
              <i class="fa-solid ${lab.icon}"></i>
            </div>

            <h3>${lab.title}</h3>

            <p>${lab.subtitle}</p>

            <div class="lab-meta">
              <span class="lab-badge">
                ${lab.difficulty}
              </span>

              <span class="lab-badge">
                +${lab.xp} XP
              </span>

              <span class="lab-badge">
                ${completed.includes(lab.id) ? "مكتمل ✓" : "متاح"}
              </span>
            </div>

            <button
              class="lab-open-btn"
              onclick="openLab('${lab.id}')"
            >
              ${completed.includes(lab.id) ? "إعادة فتح المختبر" : "ابدأ المختبر"}
            </button>

          </div>
        `).join("")}

      </div>
    `;
  }

  function renderBankLab() {
    const workspace =
      document.getElementById("labWorkspace");

    if (!workspace) return;

    workspace.innerHTML = `
      <div class="lab-workspace">

        <div class="lab-workspace-head">

          <div>
            <h2>
              <i class="fa-solid fa-building-columns"></i>
              ${BANK.title}
            </h2>

            <div style="color:#a6a6b5;margin-top:7px;">
              ${BANK.subtitle}
            </div>
          </div>

          <button
            class="lab-close"
            onclick="closeLab()"
          >
            إغلاق
          </button>

        </div>

        <div style="padding:20px;">

          <div class="lab-meta">

            <span class="lab-badge">
              Case: ${BANK.caseId}
            </span>

            <span class="lab-badge">
              Severity: ${BANK.severity}
            </span>

            <span class="lab-badge">
              Network: ${BANK.network}
            </span>

          </div>

          <h3 style="color:#fff;">
            Synthetic Network
          </h3>

          <div style="
            overflow:auto;
            margin-top:12px;
          ">

            <table style="
              width:100%;
              border-collapse:collapse;
              color:#ddd;
            ">

              <thead>
                <tr>
                  <th style="padding:10px;text-align:right;">
                    Host
                  </th>

                  <th style="padding:10px;text-align:right;">
                    IP
                  </th>

                  <th style="padding:10px;text-align:right;">
                    Port
                  </th>

                  <th style="padding:10px;text-align:right;">
                    Service
                  </th>
                </tr>
              </thead>

              <tbody>

                ${BANK.hosts.map(host => `
                  <tr style="
                    border-top:1px solid rgba(255,255,255,.06);
                  ">

                    <td style="padding:10px;">
                      ${host[0]}
                    </td>

                    <td style="padding:10px;">
                      ${host[1]}
                    </td>

                    <td style="padding:10px;">
                      ${host[2]}
                    </td>

                    <td style="padding:10px;">
                      ${host[3]}
                    </td>

                  </tr>
                `).join("")}

              </tbody>

            </table>

          </div>

        </div>

        <div class="lab-terminal">

          <div class="terminal-line terminal-purple">
            Midnight Training Console
          </div>

          <div class="terminal-line">
            Type "help" to see available commands.
          </div>

          <div class="terminal-line">
            Environment: SIMULATION ONLY
          </div>

          <div id="terminalOutput"></div>

          <div class="terminal-input-row">

            <input
              id="terminalInput"
              class="terminal-input"
              placeholder="type a command..."
              autocomplete="off"
            />

            <button
              class="terminal-run"
              onclick="runLabCommand()"
            >
              Run
            </button>

          </div>

        </div>

        <div class="lab-questions">

          <h3 style="color:#fff;margin-top:0;">
            Incident Questions
          </h3>

          <div id="bankQuestions"></div>

          <button
            class="lab-submit"
            onclick="submitBankLab()"
          >
            إرسال الإجابات
          </button>

          <div id="bankResult"></div>

        </div>

      </div>
    `;

    renderBankQuestions();

    const input =
      document.getElementById("terminalInput");

    if (input) {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          runLabCommand();
        }
      });
    }
  }

  function renderBankQuestions() {
    const container =
      document.getElementById("bankQuestions");

    if (!container) return;

    container.innerHTML = BANK.questions
      .map((question, index) => `
        <div
          class="lab-question"
          data-question="${index}"
        >

          <h4>
            ${index + 1}. ${question.q}
          </h4>

          <div class="lab-options">

            ${question.options.map(option => `
              <button
                class="lab-option"
                data-value="${escapeHTML(option)}"
                onclick="selectLabOption(this)"
              >
                ${escapeHTML(option)}
              </button>
            `).join("")}

          </div>

        </div>
      `)
      .join("");
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.selectLabOption = function(button) {
    const parent = button.closest(".lab-question");

    if (!parent) return;

    parent
      .querySelectorAll(".lab-option")
      .forEach(option => {
        option.classList.remove("selected");
      });

    button.classList.add("selected");
  };

  window.runLabCommand = function() {
    const input =
      document.getElementById("terminalInput");

    const output =
      document.getElementById("terminalOutput");

    if (!input || !output) return;

    const command =
      input.value.trim().toLowerCase();

    if (!command) return;

    const line = document.createElement("div");
    line.className = "terminal-line";

    line.textContent = `student@midnight:~$ ${command}`;

    output.appendChild(line);

    let response = "";

    if (command === "help") {

      response = `
Available commands:

help
status
nmap
ping auth-gw-01
ipconfig
netstat
nslookup portal-02
ls
cat /logs/auth.log
cat /logs/web.log
cat /logs/alerts.log
grep "FAILED" /logs/auth.log
grep "203.0.113.77" /logs/auth.log
timeline
evidence
report
clear
      `.trim();

    } else if (command === "status") {

      response =
        "Environment: Nexora Capital Bank [SIMULATION]\nCase: NCB-IR-2026-0919\nStatus: Investigation active";

    } else if (command === "nmap") {

      response = BANK.nmap.join("\n");

    } else if (command === "ping auth-gw-01") {

      response =
        "PING auth-gw-01 (10.44.18.10): 56 data bytes\n64 bytes from 10.44.18.10: icmp_seq=0 ttl=64 time=1.2 ms\n--- SIMULATION RESULT ---\n0% packet loss";

    } else if (command === "ipconfig") {

      response =
        "Training Adapter\nIPv4 Address: 10.44.18.40\nSubnet Mask: 255.255.255.0\nGateway: 10.44.18.1";

    } else if (command === "netstat") {

      response =
        "Proto   Local Address       State\nTCP     10.44.18.40:22      LISTENING\nTCP     10.44.18.40:443     ESTABLISHED";

    } else if (command === "nslookup portal-02") {

      response =
        "Server: training-dns\nName: portal-02\nAddress: 10.44.18.20";

    } else if (command === "ls") {

      response =
        "/logs\n/evidence\n/reports\n/readme.txt";

    } else if (command === "cat /logs/auth.log") {

      response = BANK.logs
        .filter(line =>
          line.includes("AUTH")
        )
        .join("\n");

    } else if (command === "cat /logs/web.log") {

      response = `
[2026-09-19 08:45:07] WEB LOGIN user=finance.ops src=203.0.113.77 app=portal-02
[2026-09-19 08:47:13] API ACCESS user=finance.ops src=203.0.113.77 endpoint=/internal/ledger
      `.trim();

    } else if (command === "cat /logs/alerts.log") {

      response =
        "[2026-09-19 08:49:55] ALERT rule=impossible-travel severity=high";

    } else if (
      command === 'grep "failed" /logs/auth.log'
    ) {

      response =
        BANK.logs
          .filter(line =>
            line.toLowerCase().includes("failed")
          )
          .join("\n");

    } else if (
      command.includes("203.0.113.77")
    ) {

      response =
        BANK.logs
          .filter(line =>
            line.includes("203.0.113.77")
          )
          .join("\n");

    } else if (command === "timeline") {

      response =
        BANK.logs.join("\n");

    } else if (command === "evidence") {

      response =
        "Evidence sources:\n- Authentication logs\n- Web access logs\n- Alert logs\n- Synthetic network inventory";

    } else if (command === "report") {

      response =
        "Recommended report:\nIncident: Account compromise / unauthorized access\nUser: finance.ops\nSource: 203.0.113.77\nPriority: High\nPreserve authentication, web and alert logs.";

    } else if (command === "clear") {

      output.innerHTML = "";
      input.value = "";
      return;

    } else if (
      command === "curl https://ncb.local/portal"
    ) {

      response =
        "[SIMULATION] 200 OK — portal-02 — training environment";

    } else {

      response =
        "command not available in training console";

    }

    const responseLine =
      document.createElement("div");

    responseLine.className =
      "terminal-line terminal-green";

    responseLine.textContent = response;

    output.appendChild(responseLine);

    input.value = "";

    const terminal =
      document.querySelector(".lab-terminal");

    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  };

  window.submitBankLab = function() {
    const questions =
      document.querySelectorAll(".lab-question");

    let score = 0;

    questions.forEach((questionElement, index) => {

      const selected =
        questionElement.querySelector(
          ".lab-option.selected"
        );

      if (
        selected &&
        selected.dataset.value ===
          BANK.questions[index].answer
      ) {
        score++;
      }
    });

    const result =
      document.getElementById("bankResult");

    if (!result) return;

    const total = BANK.questions.length;

    if (score === total) {

      const firstCompletion =
        saveCompletedLab("bank");

      if (firstCompletion) {
        addXP(LAB_XP.bank);
      }

      result.className =
        "lab-result success";

      result.textContent =
        `ممتاز 🔥 كل الإجابات صحيحة ${score}/${total} — حصلت على +${firstCompletion ? LAB_XP.bank : 0} XP`;

      renderLabsHub();

      showToast(
        firstCompletion
          ? `تم إكمال المختبر +${LAB_XP.bank} XP`
          : "المختبر مكتمل مسبقًا"
      );

    } else {

      result.className =
        "lab-result fail";

      result.textContent =
        `نتيجتك ${score}/${total}. راجع السجلات والأدلة وحاول مرة ثانية.`;
    }
  };

  function renderSimpleLab(lab) {
    const workspace =
      document.getElementById("labWorkspace");

    if (!workspace) return;

    const content = {

      phishing: `
        <h3 style="color:#fff;">
          Synthetic Email Headers
        </h3>

        <pre>
From: billing@secure-nexora-support.example
Reply-To: billing-confirm@secure-nexora-support.example
Subject: Urgent account verification
Received: training-mail-gateway
Authentication-Results:
  SPF: fail
  DKIM: fail
  DMARC: fail

[SIMULATION ONLY]
        </pre>

        <p style="color:#a6a6b5;line-height:1.8;">
          الهدف: حدد المؤشرات المشبوهة ثم اكتب تقريرًا مختصرًا.
        </p>

        <button
          class="lab-submit"
          onclick="completeSimpleLab('phishing')"
        >
          إنهاء المختبر
        </button>
      `,

      soc: `
        <h3 style="color:#fff;">
          Synthetic SOC Alerts
        </h3>

        <pre>
[HIGH] Multiple failed logins
Source: 203.0.113.77
User: finance.ops

[MEDIUM] Unusual login time
User: finance.ops

[HIGH] Impossible travel
User: finance.ops

[SIMULATION ONLY]
        </pre>

        <p style="color:#a6a6b5;line-height:1.8;">
          الهدف: رتب التنبيهات حسب الأولوية وحدد الحادثة التي تحتاج تحقيقًا.
        </p>

        <button
          class="lab-submit"
          onclick="completeSimpleLab('soc')"
        >
          إنهاء المختبر
        </button>
      `,

      endpoint: `
        <h3 style="color:#fff;">
          Synthetic Endpoint Investigation
        </h3>

        <pre>
Process Tree

explorer.exe
 └─ powershell.exe
     └─ training-script.exe

Network:
training-script.exe
 → 203.0.113.77

[SIMULATION ONLY]
        </pre>

        <p style="color:#a6a6b5;line-height:1.8;">
          الهدف: اكتشف العملية غير المعتادة واربطها بالنشاط الشبكي.
        </p>

        <button
          class="lab-submit"
          onclick="completeSimpleLab('endpoint')"
        >
          إنهاء المختبر
        </button>
      `,

      web: `
        <h3 style="color:#fff;">
          Synthetic Web Incident
        </h3>

        <pre>
10.44.18.20 - GET /login 200
10.44.18.20 - POST /login 401
10.44.18.20 - POST /login 401
10.44.18.20 - POST /login 200
203.0.113.77 - GET /internal/ledger 200
203.0.113.77 - GET /internal/ledger 200

[SIMULATION ONLY]
        </pre>

        <p style="color:#a6a6b5;line-height:1.8;">
          الهدف: اكتشاف النشاط غير المعتاد في سجلات الويب.
        </p>

        <button
          class="lab-submit"
          onclick="completeSimpleLab('web')"
        >
          إنهاء المختبر
        </button>
      `
    };

    workspace.innerHTML = `
      <div class="lab-workspace">

        <div class="lab-workspace-head">

          <div>
            <h2>
              <i class="fa-solid fa-flask"></i>
              ${lab.title}
            </h2>

            <div style="color:#a6a6b5;margin-top:7px;">
              ${lab.subtitle}
            </div>
          </div>

          <button
            class="lab-close"
            onclick="closeLab()"
          >
            إغلاق
          </button>

        </div>

        <div class="simple-lab-content">
          ${content[lab.id]}
        </div>

      </div>
    `;
  }

  window.completeSimpleLab = function(id) {
    const lab =
      OTHER_LABS.find(item => item.id === id);

    if (!lab) return;

    const firstCompletion =
      saveCompletedLab(id);

    if (firstCompletion) {
      addXP(lab.xp);

      showToast(
        `تم إكمال المختبر +${lab.xp} XP`
      );

    } else {

      showToast(
        "المختبر مكتمل مسبقًا"
      );

    }

    renderLabsHub();
  };

  window.openLab = function(id) {
    showWarning(() => {

      if (id === "bank") {
        renderBankLab();
        return;
      }

      const lab =
        OTHER_LABS.find(
          item => item.id === id
        );

      if (lab) {
        renderSimpleLab(lab);
      }

    });
  };

  window.closeLab = function() {
    const workspace =
      document.getElementById("labWorkspace");

    if (workspace) {
      workspace.innerHTML = "";
    }

    renderLabsHub();
  };

  window.openLabs = function() {
    showWarning(() => {

      if (typeof window.showPage === "function") {
        window.showPage("labs");
      }

      setTimeout(() => {
        renderLabsHub();
      }, 50);

    });
  };

  function initializeLabs() {
    injectStyles();
    renderLabsHub();
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeLabs
    );

  } else {

    initializeLabs();

  }

})();