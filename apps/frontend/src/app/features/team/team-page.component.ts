import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  email: string;
  role: 'Admin' | 'Architect' | 'Developer' | 'Viewer';
  avatar: string;
  status: 'Active' | 'Pending';
  lastActive: string;
}

@Component({
  selector: 'cdl-team-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="team-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Team & Workspace Members</h1>
          <p class="page-subtitle">Manage organization permissions, role assignments, and member access</p>
        </div>
        <button class="btn btn-primary" (click)="inviteMember()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Invite Team Member
        </button>
      </div>

      <div class="card-panel table-card">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>MEMBER</th>
                <th>ROLE</th>
                <th>SSO STATUS</th>
                <th>LAST ACTIVE</th>
                <th style="text-align: right;">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let member of members()">
                <td>
                  <div class="user-box">
                    <div class="user-avatar">{{ member.avatar }}</div>
                    <div class="user-details">
                      <span class="user-name">{{ member.name }}</span>
                      <span class="user-email">{{ member.email }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" [class.admin]="member.role === 'Admin'" [class.architect]="member.role === 'Architect'">
                    {{ member.role }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-success">OKTA SSO</span>
                </td>
                <td><span class="last-active">{{ member.lastActive }}</span></td>
                <td style="text-align: right;">
                  <button class="btn btn-sm btn-secondary">Edit Role</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .team-page {
      padding: 1.75rem;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0 0 0.25rem; }
    .page-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0; }

    .custom-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .custom-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.7rem;
      font-weight: 700;
      color: #6b7280;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #e5e7eb;
      background: #f8fafc;
    }
    .custom-table td { padding: 1rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }

    .user-box { display: flex; align-items: center; gap: 0.75rem; }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-weight: 600; color: #111827; }
    .user-email { font-size: 0.75rem; color: #6b7280; }

    .role-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      background: #f1f5f9;
      color: #475569;
    }
    .role-badge.admin { background: #fee2e2; color: #b91c1c; }
    .role-badge.architect { background: #eff6ff; color: #1d4ed8; }

    .last-active { font-size: 0.8rem; color: #6b7280; }
  `],
})
export class TeamPageComponent {
  public members = signal<TeamMember[]>([
    {
      name: 'Mohammad Ali',
      email: 'm.ali@codelens.io',
      role: 'Architect',
      avatar: 'MA',
      status: 'Active',
      lastActive: 'Now',
    },
    {
      name: 'Sarah Chen',
      email: 's.chen@codelens.io',
      role: 'Admin',
      avatar: 'SC',
      status: 'Active',
      lastActive: '12m ago',
    },
    {
      name: 'Alex Rivera',
      email: 'a.rivera@codelens.io',
      role: 'Developer',
      avatar: 'AR',
      status: 'Active',
      lastActive: '2h ago',
    },
  ]);

  public inviteMember(): void {
    alert('Invite Team Member Modal Triggered!');
  }
}
