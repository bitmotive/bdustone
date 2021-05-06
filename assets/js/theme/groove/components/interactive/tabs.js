/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   Simple tabs pattern example
*/
export default class Tabs {
    constructor() {
    }

    init() {

        'use strict';

        Array.prototype.slice.call(document.querySelectorAll('.tabs')).forEach(function (tabs) {

        // Allow for multiple tabs sections to be expanded at the same time
        var tabsVertical = tabs.hasAttribute('data-tabs-vertical');

        // Allow for multiple accordion sections to be expanded at the same time
        var allowMultiple = tabs.hasAttribute('data-allow-multiple');
        // Allow for each toggle to both open and close individually
        var allowToggle = (allowMultiple) ? allowMultiple : tabs.hasAttribute('data-allow-toggle');

        // Create the array of toggle elements for the tabs group
        var triggers = Array.prototype.slice.call(tabs.querySelectorAll('dt>button'));
        var panels = Array.prototype.slice.call(tabs.querySelectorAll('dd'));

        

        tabs.addEventListener('click', function (event) {
            var target = event.target;
            
            if (target.tagName === "BUTTON") {
              // Check if the current toggle is expanded.
              var isExpanded = target.getAttribute('aria-expanded') == 'true';
              
              var active = tabs.querySelector('[aria-expanded="true"]');
        
              // without allowMultiple, close the open accordion
              if (!allowMultiple && active && active !== target) {
                // Set the expanded state on the triggering element
                active.setAttribute('aria-expanded', 'false');
                // Hide the accordion sections, using aria-controls to specify the desired section
                document.getElementById(active.getAttribute('aria-controls')).setAttribute('hidden', '');
        
                // When toggling is not allowed, clean up disabled state
                if (!allowToggle) {
                  active.removeAttribute('aria-disabled');
                }
              }
        
              if (!isExpanded) {
                // Set the expanded state on the triggering element
                target.setAttribute('aria-expanded', 'true');
                // Hide the accordion sections, using aria-controls to specify the desired section
                document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');
        
                // If toggling is not allowed, set disabled state on trigger
                if (!allowToggle) {
                  target.setAttribute('aria-disabled', 'true'); 
                }
              }
              else if (allowToggle && isExpanded) {
                // Set the expanded state on the triggering element
                target.setAttribute('aria-expanded', 'false');
                // Hide the accordion sections, using aria-controls to specify the desired section
                document.getElementById(target.getAttribute('aria-controls')).setAttribute('hidden', '');
              }
        
              event.preventDefault();
            }
          });

        // Bind keyboard behaviors on the main tabs container
        tabs.addEventListener('keydown', function (event) {
            var target = event.target;
            var key = event.which.toString();
            // 33 = Page Up, 34 = Page Down
            var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

            // Is this coming from an tabs header?
            if (target.tagName === "BUTTON") {
            // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
            // 37 = Left, 29 = Right
            // 38 = Up, 40 = Down
            if (!tabsVertical && key.match(/37|39/)) {
                var index = triggers.indexOf(target);
                var direction = (key.match(/34|39/)) ? 1 : -1;
                var length = triggers.length;
                var newIndex = (index + length + direction) % length;

                triggers[newIndex].focus();

                event.preventDefault();
            } else if (tabsVertical && key.match(/38|40/)) {
                var index = triggers.indexOf(target);
                var direction = (key.match(/34|40/)) ? 1 : -1;
                var length = triggers.length;
                var newIndex = (index + length + direction) % length;

                triggers[newIndex].focus();

                event.preventDefault();
            } else if (key.match(/35|36/)) {
                // 35 = End, 36 = Home keyboard operations
                switch (key) {
                // Go to first tabs
                case '36':
                    triggers[0].focus();
                    break;
                    // Go to last tabs
                case '35':
                    triggers[triggers.length - 1].focus();
                    break;
                }

                event.preventDefault();
            }
            }
            else if (ctrlModifier) {
            // Control + Page Up/ Page Down keyboard operations
            // Catches events that happen inside of panels
            panels.forEach(function (panel, index) {
                if (panel.contains(target)) {
                triggers[index].focus();

                event.preventDefault();
                }
            });
            }
        });

        });
    }
}
