/**
 *  パスワード変更
 *  @version 1.0
 *  @author
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AdminUserService } from '../../admin-user.service';
import { Modal, MODAL_TYPE } from '../../../../common/core-components/modals/modal.component';
import { ValidateDirective } from '../../../../common/core-components/validate/validate.component';
import { I18NService } from '../../../../common/core-services/i18n.service';
import { UserInfoService } from '../../../../common/core-services/user-info.service';

@Component({
  selector: 'password-change-modal',
  templateUrl: './password-change-modal.component.html',
  styleUrls: ['./password-change-modal.component.css']
})
export class PasswordChangeModalComponent implements OnInit {

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('passwordForm') form: ValidateDirective;

  // パスワードの認証
  passwordRules: any;

  // フォームのデータ
  passWordFrom: any;
  resources: any;

  constructor(
    private translate: I18NService,
    private userInfoService: UserInfoService,
    private adminService: AdminUserService
  ) {
    this.translate.getResource('message').subscribe((res: any) => {
      this.resources = res;
    });
  }

  // 初期化
  ngOnInit() {
    this.passwordRules = [
      ['currentPassword', { required: true, password: true, minlength: [10, true] }],
      ['newPassword', {
        required: true, password: true, minlength: [10, true],
        func: [() => {
          if (RegExp(this.userInfoService.userInfo.userId).test(this.passWordFrom.newPassword)) {
            return false;
          }
          return true;
        }, this.resources.E112120]
      }],
      ['confirmPassword', {
        required: true, password: true, minlength: [10, true],
        func: [() => {
          if (this.passWordFrom.newPassword !== this.passWordFrom.confirmPassword) {
            return false;
          }
          return true;
        }, this.resources.E112110]
      }]
    ];
    this.passWordFrom = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  closeModal = () => {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  changeCancel() {
    this.closeModal();
  }

  change() {
    if (this.form.check()) {
      const body = {
        currentPassword: this.passWordFrom.currentPassword,
        newPassword: this.passWordFrom.newPassword
      };
      this.adminService.passwordChange(body).subscribe(resp => {
        Modal({
          type: MODAL_TYPE.INFO,
          content: this.resources.I000080,
          onHidden: () => {
            this.closeModal();
            // todo
          }
        });
      }, err => { });
    }
  }

  // ボタン有効化
  isValidForm() {
    if (this.passWordFrom.currentPassword && this.passWordFrom.newPassword && this.passWordFrom.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

}
