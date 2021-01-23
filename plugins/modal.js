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
         <div class="vmodal__body-main">
            ${options.content || ''}
         </div>
         <div class="vmodal__body-footer">
            <button class="btn btn btn-outline-secondary">Ok</button>
            <button class="btn btn btn-outline-secondary">Close</button>
         </div>
      </div>
   </div>
   `)
   document.body.appendChild(modal);
   return modal;
}


$.modal = function (options) {
   const $modal = _createModal(options);
   let closing = false;
   destroyed = false;

   const modal = {
      open() {
         !closing && $modal.classList.add('open');
      },
      close() {
         closing = true;
         $modal.classList.remove('open');
         closing = false;
      },
      destroy() { }
   }

   $modal.addEventListener('click', event => {
      if (event.target.dataset.close) {
         modal.close();
      }
   })

   return Object.assign(modal, {
      destroy() {
         $modal.parentNode.removeChild($modal);
         destroyed = true;
      }
   })
}