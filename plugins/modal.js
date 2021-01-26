Element.prototype.appendAfter = function (element) {
   element.parentNode.insertBefore(this, element.nextSibling);
}

function noop() {}

function _createModalFooter(buttons = []) {
   if (buttons.length === 0) {
      return document.createElement('div');
   }
   const wrap = document.createElement('div');
   wrap.classList.add('vmodal__body-footer');

   buttons.forEach(btn => {
      const $btn = document.createElement('button');
      $btn.textContent = btn.text;
      $btn.classList.add('btn');
      $btn.classList.add(`btn-${btn.type || 'secondary'}`);
      $btn.onclick = btn.handler || noop;

      wrap.appendChild($btn);
   })

   return wrap;
}

function _createModal(options) {  // системная приватная функция, не должна вызываться отдельно
   const DEFAULT_WIDTH = '50%';
   const modal = document.createElement('div');
   modal.classList.add('vmodal');
   modal.insertAdjacentHTML('afterbegin', `
   <div class="vmodal__overlay" data-close="true">
      <div class="vmodal__body" stryle="width: ${options.width || DEFAULT_WIDTH}">
         <div class="vmodal__body-header">
            <span class="modal-title">${options.title || 'Title'}</span>
            ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
         </div>
         <div class="vmodal__body-main" data-content>
            ${options.content || ''}
         </div>
      </div>
   </div>
   `)
   const footer = _createModalFooter(options.footerButtons);
   footer.appendAfter(modal.querySelector('[data-content]'));
   document.body.appendChild(modal);
   return modal;
}


$.modal = function (options) {
   const $modal = _createModal(options);
   let closing = false;
   destroyed = false;

   const modal = {
      open() {
         if (destroyed) {
            return console.log('Modal is destroyed');
         }
         !closing && $modal.classList.add('open');
      },
      close() {
         closing = true;
         $modal.classList.remove('open');
         closing = false;
         if (typeof options.onClose === 'function') {
            options.onClose();
         }
      },
      destroy() { }
   }

   const listener = event => {
      if (event.target.dataset.close) {
         modal.close();
      }
   }

   $modal.addEventListener('click', listener);

   return Object.assign(modal, {
      destroy() {
         $modal.parentNode.removeChild($modal);
         $modal.removeEventListener('click', listener);
         destroyed = true;
      },
      setContent(html) {
         $modal.querySelector('[data-content]').innerHTML = html;
      }
   })
}